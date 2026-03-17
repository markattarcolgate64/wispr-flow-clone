export function createMockAudio() {
  return {
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    onended: null as (() => void) | null,
    src: "",
    currentTime: 0,
  };
}
