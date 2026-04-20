export const PAGE_SIZE = 10

interface Student {
  id: string
  name: string
  nationalId: string
  totalLessonCount: number
}

export const paginate = (
  students: Student[],
  pageSize: number,
  pageNumber: number,
) => {
  return students?.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

export const pages = (studentsLength: number) => {
  if (studentsLength === undefined) return 0
  else {
    return Math.ceil(studentsLength / PAGE_SIZE)
  }
}
