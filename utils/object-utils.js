export const printObjectHierarchy = (obj, indent = "") => {
  const keys = Object.keys(obj);
  // Sort the keys alphabetically
  keys.sort();

  for (const key of keys) {
    if (typeof obj[key] === "object") {
      console.log(indent + key);
      printObjectHierarchy(obj[key], indent + " "); // Add space for indentation
    } else {
      console.log(indent + key);
    }
  }
};
