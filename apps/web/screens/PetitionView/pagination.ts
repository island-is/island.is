export const PAGE_SIZE = 3

export function paginate(petitions, pageSize, pageNumber) {
  if (petitions === undefined) return
  else {
    return petitions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  }
}

export function pages(petitionsLength) {
  if (petitionsLength === undefined) return 0
  else {
    return Math.ceil(petitionsLength / PAGE_SIZE)
  }
}
