import gql from 'graphql-tag'

export const ViewSingleStudentQuery = gql`
  query drivingBookStudent($input: StudentInput!) {
    drivingBookStudent(input: $input) {
      id
      name
      nationalId
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
          teacherNationalId
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
`

export const InstructorsStudentsQuery = gql`
  query drivingBookStudentListByTeacherNationalId {
    drivingBookStudentListByTeacherNationalId {
      id
      name
      nationalId
      totalLessonCount
    }
  }
`

export const FindStudentQuery = gql`
  query drivingBookStudentList($input: StudentListInput!) {
    drivingBookStudentList(input: $input) {
      id
      name
      nationalId
    }
  }
`
