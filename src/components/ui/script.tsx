"use client";

import { useEffect, useState } from "react";
import NextScript from "next/script";

interface OptimizedScriptProps {
  src: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
  onLoad?: () => void;
  id?: string;
}

export function OptimizedScript({
  src,
  strategy = "afterInteractive",
  onLoad,
  id,
}: OptimizedScriptProps) {
  const [shouldLoad, setShouldLoad] = useState(strategy === "beforeInteractive");

  useEffect(() => {
    // 如果策略是lazyOnload，则使用Intersection Observer延迟加载
    if (strategy === "lazyOnload") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: "200px" }
      ); // 提前200px加载

      // 观察body，当用户滚动到接近底部时加载脚本
      observer.observe(document.body);

      return () => observer.disconnect();
    }

    // 如果策略是afterInteractive，在页面空闲时加载
    if (strategy === "afterInteractive") {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        const handle = (window as any).requestIdleCallback(
          () => {
            setShouldLoad(true);
          },
          { timeout: 2000 }
        );

        return () => (window as any).cancelIdleCallback(handle);
      } else {
        // 如果不支持requestIdleCallback，使用setTimeout
        const timeout = setTimeout(() => setShouldLoad(true), 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [strategy]);

  if (!shouldLoad) {
    return null;
  }

  return <NextScript src={src} strategy={strategy as any} onLoad={onLoad} id={id} />;
}
