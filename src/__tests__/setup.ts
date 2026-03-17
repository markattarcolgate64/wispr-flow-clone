import "@testing-library/jest-dom";
// Polyfill Web APIs missing from jsdom
if (typeof globalThis.TextEncoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const util = require("util");
  Object.assign(globalThis, {
    TextEncoder: util.TextEncoder,
    TextDecoder: util.TextDecoder,
  });
}
if (typeof globalThis.ReadableStream === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ReadableStream } = require("stream/web");
  Object.assign(globalThis, { ReadableStream });
}

// Stub URL.createObjectURL / URL.revokeObjectURL
if (typeof URL.createObjectURL === "undefined") {
  URL.createObjectURL = jest.fn(() => "blob:mock-url");
}
if (typeof URL.revokeObjectURL === "undefined") {
  URL.revokeObjectURL = jest.fn();
}

// Stub HTMLMediaElement.prototype.play
HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
