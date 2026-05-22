import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const isMobileView = window.innerWidth <= 1024;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (isMobileView || !hasFinePointer) {
      return;
    }

    let hover = false;
    const cursor = cursorRef.current!;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    
    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    let frameId: number;
    const loop = () => {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        gsap.to(cursor, { x: cursorPos.x, y: cursorPos.y, duration: 0.1 });
      }
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    const mouseOverHandlers = new Map<HTMLElement, { over: (e: MouseEvent) => void; out: () => void }>();

    document.querySelectorAll("[data-cursor]").forEach((item) => {
      const element = item as HTMLElement;
      
      const handleMouseOver = () => {
        const rect = element.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const handleMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseout", handleMouseOut);
      mouseOverHandlers.set(element, { over: handleMouseOver, out: handleMouseOut });
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameId);
      mouseOverHandlers.forEach((handlers, element) => {
        element.removeEventListener("mouseover", handlers.over);
        element.removeEventListener("mouseout", handlers.out);
      });
    };
  }, []);

  const isMobileView = typeof window !== "undefined" && window.innerWidth <= 1024;
  const hasFinePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  if (isMobileView || !hasFinePointer) {
    return null;
  }

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
