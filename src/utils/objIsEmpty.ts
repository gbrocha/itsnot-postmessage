interface IObjIsEmpty {
  <T = Record<string, unknown>>(obj: T): boolean
}

const objIsEmpty: IObjIsEmpty = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object

export { objIsEmpty }
