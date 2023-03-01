export const urlEncode = (object: object): string => {
  let fBody = [];
  for (let prop in object) {
    let key = encodeURIComponent(prop);
    let value = encodeURIComponent(object[prop]);
    fBody.push(key + '=' + value);
  }
  return fBody.join('&');
};
