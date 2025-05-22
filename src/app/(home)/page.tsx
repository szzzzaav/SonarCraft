"use client";
import React, { Suspense } from "react";
import { Head } from "./Head";
import dynamic from "next/dynamic";

// 使用动态导入延迟加载非关键组件
const Bottom = dynamic(() => import("./Bottom").then((mod) => ({ default: mod.Bottom })), {
  loading: () => <div className="min-h-[300px] flex items-center justify-center">加载中...</div>,
  ssr: true,
});

// 使用动态导入加载Demo组件
const Sticky = dynamic(() => import("./Demo").then((mod) => ({ default: mod.Sticky })), {
  loading: () => (
    <div className="min-h-[500px] bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
  ),
  ssr: false, // 复杂交互组件客户端渲染
});

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      {/* 首屏内容直接加载 */}
      <Head />

      {/* 使用Suspense包装懒加载组件 */}
      <Suspense
        fallback={
          <div className="min-h-[500px] bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
        }
      >
        <Sticky />
      </Suspense>

      {/* 页面底部内容懒加载 */}
      <Suspense
        fallback={<div className="min-h-[300px] flex items-center justify-center">加载中...</div>}
      >
        <Bottom />
      </Suspense>
    </div>
  );
}
