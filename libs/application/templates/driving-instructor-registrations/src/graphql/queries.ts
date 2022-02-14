import gql from 'graphql-tag'

export const ViewSingleStudentQuery = gql`
  query drivingBookStudent($input: StudentInput!) {
    drivingBookStudent(input: $input) {
      data {
        id
        name
        ssn
        book {
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
  query drivingBookStudentListByTeacherSsn {
    drivingBookStudentListByTeacherSsn {
      data {
        id
        name
        ssn
        totalLessonCount
      }
    }
  }
`
