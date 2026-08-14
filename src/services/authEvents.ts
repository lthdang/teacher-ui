type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

export const authEvents = {
  onUnauthorized: (fn: UnauthorizedHandler) => {
    handler = fn;
  },
  emitUnauthorized: () => {
    handler?.();
  },
};