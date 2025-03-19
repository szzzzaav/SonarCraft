"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col px-4 relative">
      <div className="absolute top-32 left-8">
        <p className="text-sm">LET'S TALK</p>
      </div>

      <div className="absolute top-8 right-8">
        <p className="text-sm">
          ONLY THE
          <br />
          STRONG EVOLVE
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[8vw] leading-none font-bold tracking-tight">
            HELLO@
            <br />
            SONAR
            <br />
            .COM
          </h1>

          <div className="mt-12">
            <a href="#" className="inline-flex items-center gap-2 hover:opacity-70">
              <span className="rotate-90 text-xl">↓</span>
              <span>BOOK A 15 MIN CALL</span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
        <p className="text-sm">[S.01]</p>
      </div>
    </div>
  );
}
