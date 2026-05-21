/// <reference types="vite/client" />

declare module 'gsap/SplitText' {
  export class SplitText {
    constructor(target: any, vars?: Record<string, any>);
    chars: any[];
    words: any[];
    lines: any[];
    revert(): void;
    split(vars?: Record<string, any>): void;
  }
}

declare module 'gsap/ScrollSmoother' {
  export class ScrollSmoother {
    static create(vars?: Record<string, any>): ScrollSmoother;
    static refresh(safe?: boolean): void;
    paused(value?: boolean): ScrollSmoother | boolean;
    scrollTo(target: any, smooth?: boolean, position?: string): void;
    scrollTop(value?: number): number;
    kill(): void;
  }
}
