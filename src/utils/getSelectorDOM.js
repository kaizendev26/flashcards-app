const $ = (element) => {
  return {
    on: (event, callback) => {
      document.addEventListener(event, function (e) {
        const targetElement = e.target.closest(element);
        if (targetElement) {
          callback(targetElement);
        }
      });
    },
    get: () => document.querySelector(element),
    all: () => document.querySelectorAll(element),
  };
};

export default $;
