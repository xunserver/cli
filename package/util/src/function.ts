export const ignoreError = (fn: Function, context: any, ...args: any[]) => {
  try {
    return fn.apply(context, args);
  } catch (err) {
    console.error(err);
  }
};
