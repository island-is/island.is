import { gql } from '@apollo/client'

export const STUDENTS_OWERVIEW = gql`
  query studentListTeacherSsn {
    studentListTeacherSsn {
      data {
        id
        name
        ssn
        totalLessonCount
      }
    }
  }
`
