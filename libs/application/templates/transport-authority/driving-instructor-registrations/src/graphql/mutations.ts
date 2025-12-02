import gql from 'graphql-tag'

export const RegisterDrivingLesson = gql`
  mutation drivingLicenseBookCreatePracticalDrivingLesson(
    $input: CreatePracticalDrivingLessonInput!
  ) {
    drivingLicenseBookCreatePracticalDrivingLesson(input: $input) {
      id
    }
  }
`
export const DeleteDrivingLesson = gql`
  mutation drivingLicenseBookDeletePracticalDrivingLesson(
    $input: DeletePracticalDrivingLessonInput!
  ) {
    drivingLicenseBookDeletePracticalDrivingLesson(input: $input) {
      success
    }
  }
`

export const EditDrivingLesson = gql`
  mutation drivingLicenseBookUpdatePracticalDrivingLesson(
    $input: UpdatePracticalDrivingLessonInput!
  ) {
    drivingLicenseBookUpdatePracticalDrivingLesson(input: $input) {
      success
    }
  }
`

export const AllowPracticeDriving = gql`
  mutation drivingLicenseBookAllowPracticeDriving(
    $input: DrivingLicenseBookStudentInput!
  ) {
    drivingLicenseBookAllowPracticeDriving(input: $input) {
      success
    }
  }
`
