export {};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _leadFired?: boolean;
  }
}
