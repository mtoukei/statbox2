export const eventAddRemove = (() => {
  const events = {};
  let key = 0;
  return {
    addListener: (target, type, listener, capture) => {
      target.addEventListener(type, listener, capture);
      events[key] = {
        target: target,
        type: type,
        listener: listener,
        capture: capture
      };
      return key++;
    },
    removeListener: key => {
      if(key in events) {
        const e = events[key];
        e.target.removeEventListener(e.type, e.listener, e.capture);
      }
    }
  };
})();
