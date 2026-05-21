/// <reference types="vite/client" />

declare module 'gsap-trial/SplitText' {
  export class SplitText {
    constructor(target: any, vars?: Record<string, any>);
    chars: any[];
    words: any[];
    lines: any[];
    revert(): void;
    split(vars?: Record<string, any>): void;
  }
}
