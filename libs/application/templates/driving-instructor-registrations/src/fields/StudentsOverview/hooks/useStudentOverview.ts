import { Application, getValueViaPath } from '@island.is/application/core'
import { STUDENTS_OWERVIEW } from './queries.graphql'
import { useQuery, ApolloError } from '@apollo/client'

export type StudentListTeacherSsn = {
    studentList: Student[],
    loading: boolean
    error: ApolloError | undefined
}

 export interface Student {
    id: string
    ssn: string
    name: string
    totalLessonCount: number
}


export const useStudentsOverview = (): StudentListTeacherSsn => {

  const { data, loading, error } = useQuery(STUDENTS_OWERVIEW)

  const studentList: StudentListTeacherSsn = {
    studentList: data?.data,
    loading: loading,
    error: error,
  }

  return studentList
}
