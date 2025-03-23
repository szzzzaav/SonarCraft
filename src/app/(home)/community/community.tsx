"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { CommunityCarousel } from "./community-carousel";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Logo } from "@/components/ui/logo";

const Community = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div id="community" className="p-5 relative min-h-[150vh] w-[100vw] bg-[#000]">
      <div
        className={twMerge(
          "menu-toggle absolute top-8 right-8 w-[150px] h-[60px] bg-[#1d1d1d] rounded-[8em] cursor-pointer z-[2]",
          isOpen ? "w-[60px]" : ""
        )}
        style={{
          transition: "width 0.5s cubiz-bezier(0.075,0.82,0.165,1)",
          transformOrigin: "right",
        }}
      >
        <div
          className="menu-toggle-icon absolute right-0 w-[60px] h-[60px] rounded-full bg-[#fff] transition-all z-10 overflow-hidden"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          style={{
            clipPath: isOpen ? "circle(50% at 50% 50%)" : "circle(10% at 50% 50%)",
            transform: isOpen ? "scale(1.125)" : "",
          }}
        >
          <div
            className={twMerge(
              "hamburger absolute top-[60%] left-[50%] w-[30px] h-[30px] flex justify-center items-center transition-all opacity-0",
              isOpen ? "top-[50%] opacity-100" : ""
            )}
            style={{
              transform: "translate(-50%,-50%)",
            }}
          >
            <div
              className={twMerge(
                "menu-bar absolute w-[15px] h-[1.5px] bg-[#000] transition-all translate-y-[3px]",
                isOpen ? "translate-y-0 rotate-[45deg] scale-x-[1.05]" : ""
              )}
              style={{ transitionProperty: "transform" }}
              data-position="top"
            ></div>
            <div
              className={twMerge(
                "menu-bar absolute w-[15px] h-[1.5px] bg-[#000] transition-all translate-y-[-3px]",
                isOpen ? "translate-y-0 rotate-[-45deg] scale-x-[1.05]" : ""
              )}
              style={{ transitionProperty: "transform" }}
              data-position="bottom"
            ></div>
          </div>
        </div>
        <div
          className={twMerge(
            "menu-copy absolute top-[50%] left-[30px] translate-y-[-50%] text-[#fff] z-[1]",
            isOpen ? "opacity-0" : ""
          )}
          style={{ transition: "left 0.5s cubic-bezier(0.075,0.82,0.165,1)" }}
        >
          <p className="uppercase font-medium text-[12px] m-0 p-0">Your Work</p>
        </div>
      </div>

      <div
        className="menu absolute top-0 left-0 w-screen min-h-[150vh] p-5 flex bg-[#0f0f0f]"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <div
          className="col col-1 flex-[1] relative h-full flex flex-col justify-between items-end"
          style={{ padding: "10em 2em 2em 2em" }}
        >
          <div className="menu-logo  absolute top-8 left-8">
            <a
              href="#"
              className="uppercase text-[60px] font-bold"
              style={{
                fontFamily: "Impact",
              }}
            >
              {isOpen && <div className="yourwork">Your Work</div>}
              {!isOpen && <div className="trending">Trending</div>}
            </a>
          </div>

          <Unauthenticated>
            <div className="links pleaseLogIn">
              <div className="link relative">
                <a href="" className="text-[#fff] text-[48px] font-light leading-[125%]">
                  PLEASE
                </a>
              </div>
              <div className="link relative">
                <a href="" className="text-[#fff] text-[48px] font-light leading-[125%]">
                  LOG IN
                </a>
              </div>
              <div className="link relative">
                <a href="" className="text-[#fff] text-[48px] font-light leading-[125%]">
                  TO
                </a>
              </div>
              <div className="link relative">
                <a href="" className="text-[#fff] text-[48px] font-light leading-[125%]">
                  CHECK IT OUT
                </a>
              </div>
            </div>
          </Unauthenticated>
          <Authenticated>
            <div className="w-[90vw] h-screen flex items-center justify-center self-start scale-x-60 relative z-[999] ">
              <CommunityCarousel user={isOpen} />
            </div>
          </Authenticated>
          <AuthLoading>
            <div className="flex items-center justify-center">
              <svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 25C20 30 15 35 10 35C5 35 0 30 0 25C0 20 5 15 10 15C15 15 20 20 20 25Z"
                  fill="#ffffff"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0s"
                  />
                </path>
                <path
                  d="M45 25C45 30 40 35 35 35C30 35 25 30 25 25C25 20 30 15 35 15C40 15 45 20 45 25Z"
                  fill="#ffffff"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.2s"
                  />
                </path>
                <path
                  d="M70 25C70 30 65 35 60 35C55 35 50 30 50 25C50 20 55 15 60 15C65 15 70 20 70 25Z"
                  fill="#ffffff"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.4s"
                  />
                </path>
              </svg>
            </div>
          </AuthLoading>
        </div>

        <div
          className="col-2 flex-[2] relative h-full flex flex-col justify-between items-end gap-[80px] text-[30px]"
          style={{ padding: "10em 2em 2em 2em" }}
        >
          <div>
            <div>+</div>
            <div>+</div>
          </div>
          <div>
            <div>+</div>
            <div>+</div>
          </div>
          <div>
            <div>+</div>
            <div>+</div>
          </div>
        </div>

        <Logo />
      </div>
    </div>
  );
};

export default Community;
