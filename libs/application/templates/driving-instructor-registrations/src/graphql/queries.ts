import gql from 'graphql-tag'

export const ViewSingleStudentQuery = gql`
  query drivingLicenseBookStudent($input: DrivingLicenseBookStudentInput!) {
    drivingLicenseBookStudent(input: $input) {
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
  query drivingLicenseBookStudentsForTeacher {
    drivingLicenseBookStudentsForTeacher {
      id
      name
      nationalId
      totalLessonCount
    }
  }
`

export const FindStudentQuery = gql`
  query drivingLicenseBookFindStudent(
    $input: DrivingLicenseBookStudentsInput!
  ) {
    drivingLicenseBookFindStudent(input: $input) {
      id
      name
      nationalId
    }
  }
`
