"use client";

import "./menu.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrganizationSwitcher, SignIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const MenuLinks = [
  { path: "/", label: "home" },
  { path: "/create", label: "create", target: "_blank" },
  { path: "/community", label: "community" },
  { path: "/contact", label: "contact" },
];

export const Title = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const tl = useRef<GSAPTimeline>(null);

  useGSAP(
    () => {
      gsap.set(".title-menu-link-item-holder", { y: 75 });
      tl.current = gsap
        .timeline({ paused: true })
        .to(".title-menu-overlay", {
          duration: 1.25,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "power4.inOut",
        })
        .to(".title-menu-link-item-holder", {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.inOut",
          delay: -0.75,
        });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (isMenuOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isMenuOpen]);

  return (
    <>
      <div className="title-menu-container" ref={containerRef}>
        <div className="title-menu-bar">
          <div className="title-menu-logo flex justify-between items-center gap-10">
            <Link
              href="/"
              className="mix-blend-difference text-[#fff] p-4 rounded-sm bg-zinc-900 hover:bg-zinc-800 transition-all"
            >
              SONAR
            </Link>
            <Authenticated>
              <div className="title-menu-open" onClick={() => setIsMenuOpen(true)}>
                <p className="mix-blend-difference text-[#fff]">MENU</p>
              </div>
            </Authenticated>
          </div>

          <a
            href="#"
            className="title-menu-button decoration-none color-[#fff] uppercase text-[18px]"
          >
            <Unauthenticated>
              <Button variant="ghost" onClick={() => setOpen(true)}>
                Sign In
              </Button>
            </Unauthenticated>
            <Authenticated>
              <div className="flex gap-3 items-center">
                <OrganizationSwitcher
                  appearance={{
                    baseTheme: dark,
                  }}
                  afterCreateOrganizationUrl="/"
                  afterLeaveOrganizationUrl="/"
                  afterSelectOrganizationUrl="/"
                  afterSelectPersonalUrl="/"
                />
                <UserButton
                  appearance={{
                    baseTheme: neobrutalism,
                  }}
                />
              </div>
            </Authenticated>
            <AuthLoading>
              <Button disabled>
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            </AuthLoading>
          </a>
        </div>
        <div className="title-menu-overlay flex flex-col justify-between items-center relative">
          <div className="title-menu-overlay-bar flex justify-between items-center w-full">
            <div className="title-menu-logo text-[#000]">
              <Link href="/">SONAR</Link>
            </div>
            <div className="title-menu-close" onClick={() => setIsMenuOpen(false)}>
              <p>Close</p>
            </div>
          </div>
          <div className="title-menu-copy w-full h-full flex flex-col justify-start p-[20em]">
            <div className="title-menu-links">
              {MenuLinks.map((link, index) => (
                <div className="title-menu-link-item" key={index}>
                  <div className="title-menu-link-item-holder" onClick={toggleMenu}>
                    <Link
                      href={link.path}
                      target={link.target || "_self"}
                      className="title-menu-link"
                    >
                      {link.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="title-menu-info"></div>
          </div>
          <div
            className="title-menu-close-icon absolute text-[#000] left-5 bottom-5"
            onClick={() => setIsMenuOpen(false)}
          >
            <p>&#x2715;</p>
          </div>
          <div className="title-menu-preview"></div>
        </div>
      </div>
      {open && (
        <Unauthenticated>
          (
          <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[999] flex justify-center items-center backdrop-blur-sm">
            <AuthLoading>
              <Button disabled>
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            </AuthLoading>
            <Authenticated>
              <Button className="text-[50px] p-10" onClick={() => setOpen(false)}>
                Welcome! Click me to Close
              </Button>
            </Authenticated>
            <SignIn
              appearance={{
                baseTheme: neobrutalism,
              }}
            />
            <div
              className="absolute top-0 right-0 p-[2em] text-[#fff] cursor-pointer rounded-full bg-black/50"
              onClick={() => setOpen(false)}
            >
              <X />
            </div>
          </div>
          )
        </Unauthenticated>
      )}
    </>
  );
};
