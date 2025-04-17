
export const isNumber = (value: string) => {
  return Object.prototype.toString.call(value) === '[object Number]'
}
