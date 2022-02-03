export const PAGE_SIZE = 10

export function paginate(students: any, pageSize: number, pageNumber: number) {
  if (students === undefined) return
  else {
    return students.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  }
}

export function pages(studentsLength: number) {
  if (studentsLength === undefined) return 0
  else {
    return Math.ceil(studentsLength / PAGE_SIZE)
  }
}
