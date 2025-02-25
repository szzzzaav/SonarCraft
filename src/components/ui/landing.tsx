"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const ROWS = 6;
const COLS = 6;
const COOLDOWN = 1000;

function createTiles(row: number, col: number) {
  const tile = document.createElement("div");
  tile.className = "landing-board-tile";
  tile.innerHTML = `
    <div class="landing-board-tile-face landing-board-tile-front">
    </div>
    <div class="landing-board-tile-face landing-board-tile-back"></div>
  `;

  const bgPosition = `${col * 20}% ${row * 20}%`;

  const frontTile = tile.querySelector(".landing-board-tile-front") as HTMLElement;
  if (frontTile) {
    frontTile.style.backgroundPosition = bgPosition;
  }
  const backTile = tile.querySelector(".landing-board-tile-back") as HTMLElement;
  if (backTile) {
    backTile.style.backgroundPosition = bgPosition;
  }
  return tile;
}

export const Landing = () => {
  const { userId } = useAuth();
  let isFlipped = false;
  const boardRef = useRef<HTMLElement | null>(null);
  function createBoard() {
    for (let i = 0; i < ROWS; i++) {
      const row = document.createElement("div");
      row.className = "landing-board-row";
      for (let j = 0; j < COLS; j++) {
        row.appendChild(createTiles(i, j));
      }
      boardRef.current?.append(row);
    }
  }

  function animateTile(tile: HTMLElement, tiltY: number) {
    gsap
      .timeline()
      .set(tile, {
        rotateX: isFlipped ? 180 : 0,
        rotateY: 0,
      })
      .to(tile, {
        rotateX: isFlipped ? 450 : 270,
        rotateY: tiltY,
        duration: 0.5,
        ease: "power2.out",
      })
      .to(
        tile,
        {
          rotateX: isFlipped ? 540 : 360,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.25"
      );
  }

  function initializeTileAnimation() {
    const tiles = document.querySelectorAll(".landing-board-tile");
    tiles.forEach((tile, index) => {
      let lastEnterTime = 0;

      tile.addEventListener("mouseenter", () => {
        const currentTime = Date.now();
        if (currentTime - lastEnterTime > COOLDOWN) {
          lastEnterTime = currentTime;

          let tiltY;
          if (index % 6 === 0) {
            tiltY = -40;
          } else if (index % 6 === 5) {
            tiltY = 40;
          } else if (index % 6 === 1) {
            tiltY = -20;
          } else if (index % 6 === 4) {
            tiltY = 20;
          } else {
            tiltY = 10;
          }

          animateTile(tile as HTMLElement, tiltY);
        }
      });
    });
  }

  function flipAllTiles(tiles: any) {
    gsap.to(tiles as HTMLElement, {
      rotateX: isFlipped ? 180 : 0,
      duration: 1,
      stagger: {
        amount: 0.5,
        from: "random",
      },
      ease: "power2.inOut",
    });
  }

  useEffect(() => {
    createBoard();
    initializeTileAnimation();
  }, []);

  useEffect(() => {
    if (userId !== undefined) {
      isFlipped = true;
      const tiles = document.querySelectorAll(".landing-board-tile");
      flipAllTiles(tiles);
    }
  }, [userId]);

  return (
    <div className="relative w-screen h-screen">
      <section
        className="board relative w-screen h-screen p-1 flex flex-col gap-1 bg-[#000] z-1"
        style={{
          perspective: "1000px",
        }}
        ref={boardRef}
      ></section>
      <div className="blocks-container absolute top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none z-10">
        <div className="blocks w-[105vw] h-screen flex flex-wrap justify-start items-start overflow-hidden"></div>
      </div>
    </div>
  );
};
