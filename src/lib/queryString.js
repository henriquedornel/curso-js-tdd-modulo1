/*module.exports.queryString = obj => {
  //console.log(Object.entries(obj)); //array de arrays
  const entries = Object.entries(obj).map(item => {
    //console.log(item);
    return `${item[0]}=${item[1]}`;
  });

  //console.log(entries);
  return entries.join('&');
};*/

// Refatorando (os testes rodando vão dizer se a implementação vai quebrar):
const keyValueToString = ([key, value]) => {
  if (typeof value === 'object' && !Array.isArray(value)) {
    // o typeof de um array é "object"
    throw new Error('Please check your params');
  }
  return `${key}=${value}`;
};

export function queryString(obj) {
  return Object.entries(obj).map(keyValueToString).join('&');
}

export function parse(string) {
  //console.log(string.split('&').map(item => item.split('=')));
  return Object.fromEntries(
    string.split('&').map(item => {
      let [key, value] = item.split('=');

      if (value.indexOf(',') > -1) {
        value = value.split(',');
      }

      return [key, value];
    }),
  );
}
