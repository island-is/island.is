import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  PrimarySchoolStudentsDocument,
  PrimarySchoolStudentsQuery,
} from '../PrimarySchool/PrimarySchool.generated'

export type PrimarySchoolStudentLoaderData = {
  studentName: string | null
  /** National id of the routed student — used to match the frigg key-info
   * child, whose id space differs from the routed (nemendagrunnur) id. */
  nationalId: string | null
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
      return {
        studentName: student?.name ?? null,
        nationalId: student?.nationalId ?? null,
      }
    } catch {
      return { studentName: null, nationalId: null }
    }
  }
