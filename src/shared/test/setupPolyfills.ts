import { TextDecoder, TextEncoder } from "util";
import "whatwg-fetch";
import {
  TransformStream,
  ReadableStream,
  WritableStream,
} from "web-streams-polyfill/ponyfill/es6";

if (typeof (globalThis as any).BroadcastChannel === "undefined") {
  class BroadcastChannelPolyfill {
    name: string;
    onmessage: ((ev: MessageEvent) => void) | null = null;

    constructor(name: string) {
      this.name = name;
    }

    postMessage(_message: any) {
      // no-op for tests
    }

    close() {
      // no-op for tests
    }

    addEventListener(
      _type: string,
      _listener: EventListenerOrEventListenerObject,
    ) {
      // no-op for tests
    }

    removeEventListener(
      _type: string,
      _listener: EventListenerOrEventListenerObject,
    ) {
      // no-op for tests
    }
  }

  (globalThis as any).BroadcastChannel = BroadcastChannelPolyfill;
}

// Ensure global encoders/decoders for msw/interceptors
// @ts-ignore
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
// @ts-ignore
if (!global.TextDecoder) global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
// @ts-ignore
if (!global.TransformStream) global.TransformStream = TransformStream;
// @ts-ignore
if (!global.ReadableStream) global.ReadableStream = ReadableStream;
// @ts-ignore
if (!global.WritableStream) global.WritableStream = WritableStream;
