"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { OrganizationSwitcher, SignIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
export const Title = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="absolute top-0 w-screen p-[2em] flex justify-between items-center h-[10vh] z-[999]">
        <a
          href="#home"
          className="decoration-none color-[#fff] uppercase text-[18px] flex items-center gap-2"
        >
          <span className="text-[18px]">SONAR</span>
        </a>
        <a href="#" className=" decoration-none color-[#fff] uppercase text-[18px]">
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
      </nav>
      {open && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[999] flex justify-center items-center backdrop-blur-sm">
          <SignIn
            appearance={{
              baseTheme: neobrutalism,
            }}
          />
          <div
            className="absolute top-0 right-0 p-[2em] text-[#fff] cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X />
          </div>
        </div>
      )}
    </>
  );
};
