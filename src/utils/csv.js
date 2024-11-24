const csvToArray = ([...colums], file) => {};

const validateTypeFileInput = (file) => {
  const allowedTypes = ["text/csv"];

  if (allowedTypes.includes(file.type)) return true;

  return false;
};

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      resolve(data);
    };

    reader.readAsText(file);
  });
};

export { readFile, csvToArray, validateTypeFileInput };
