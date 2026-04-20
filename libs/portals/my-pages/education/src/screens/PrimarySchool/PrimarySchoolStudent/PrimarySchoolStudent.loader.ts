import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  PrimarySchoolStudentsDocument,
  PrimarySchoolStudentsQuery,
} from '../PrimarySchool/PrimarySchool.generated'

export type PrimarySchoolStudentLoaderData = {
  studentName: string | null
}

export const primarySchoolStudentLoader: WrappedLoaderFn =
  ({ client }) =>
  async ({ params }): Promise<PrimarySchoolStudentLoaderData> => {
    try {
      const { data } = await client.query<PrimarySchoolStudentsQuery>({
        query: PrimarySchoolStudentsDocument,
      })
      const student = data?.primarySchoolStudents?.find(
        (s) => s.id === params['studentId'],
      )
      return { studentName: student?.name ?? null }
    } catch {
      return { studentName: null }
    }
  }
