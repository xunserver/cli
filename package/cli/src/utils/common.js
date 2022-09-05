export const sequenceIterate = async (fns, ...args) => {
  for (let i = 0; i < fns.length; i++) {
    await fns[i](...args);
  }
};

export const ignoreError = (fn, context, ...args) => {
  try {
    return fn.apply(context, args);
  } catch (err) {
    console.error(err);
  }
};
