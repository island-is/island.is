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
