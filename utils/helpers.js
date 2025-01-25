module.exports = {
  toUpperCase: (string) => string.toUpperCase(),

  eq: (a, b) => a === b, 

  contains: (array, value) => {
    if (!Array.isArray(array)) {
      console.error('Error: "array" no es un array. Valor recibido:', array);
      return false; 
    }
    return array.some((item) => item.id === value); 
  },

  formatDate: (date) => new Date(date).toLocaleDateString(), 
};
