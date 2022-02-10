import gql from 'graphql-tag'

export const ViewSingleStudentQuery = gql`
  query student($input: StudentInput!) {
    student(input: $input) {
      data {
        id
        name
        ssn
        books {
          id
          isDigital
          totalLessonTime
          totalLessonCount
          testResults {
            hasPassed
          }
          teachersAndLessons {
            id
            registerDate
            lessonTime
            teacherSsn
            teacherName
          }
          drivingSchoolExams {
            schoolTypeName
          }
          testResults {
            testTypeName
          }
        }
      }
    }
  }
`

export const InstructorsStudentsQuery = gql`
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
