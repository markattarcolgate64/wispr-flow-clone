# __tests__/

Jest test files. Directory structure mirrors `src/` (e.g., `components/Foo.test.tsx` tests `src/components/Foo.tsx`).

## Files

| File | Description |
|------|-------------|
| `setup.ts` | Jest global setup: imports `@testing-library/jest-dom`, stubs `URL.createObjectURL`, `URL.revokeObjectURL`, and `HTMLMediaElement.prototype.play` |

## Subdirectories

| Directory | Description |
|-----------|-------------|
| `components/` | Component test files |
| `mocks/` | Reusable mock factories for browser APIs |
