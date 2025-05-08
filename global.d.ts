import 'react';

interface Window extends window{
  gsap: typeof import("gsap");
}

declare module 'react' {
  // 支持 css 变量在  style 中
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
