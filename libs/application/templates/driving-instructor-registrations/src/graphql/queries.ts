import gql from 'graphql-tag'

export const ViewSingleStudentQuery = gql`
  query drivingLicenseBookStudentForTeacher(
    $input: DrivingLicenseBookStudentInput!
  ) {
    drivingLicenseBookStudentForTeacher(input: $input) {
      id
      name
      nationalId
      book {
        id
        isDigital
        totalLessonTime
        totalLessonCount
        practiceDriving
        teacherNationalId
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
          examDate
          schoolTypeId
          status
          statusName
        }
        testResults {
          testTypeName
          examDate
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
  query drivingLicenseBookFindStudentForTeacher(
    $input: DrivingLicenseBookStudentsInput!
  ) {
    drivingLicenseBookFindStudentForTeacher(input: $input) {
      id
      name
      nationalId
    }
  }
`
