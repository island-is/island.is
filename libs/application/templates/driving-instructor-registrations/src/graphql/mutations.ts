import gql from 'graphql-tag'

export const RegisterDrivingLesson = gql`
  mutation drivingBookCreatePracticalDrivingLesson(
    $input: CreatePracticalDrivingLessonInput!
  ) {
    drivingBookCreatePracticalDrivingLesson(input: $input) {
      data {
        id
      }
    }
  }
`
export const DeleteDrivingLesson = gql`
  mutation drivingBookDeletePracticalDrivingLesson(
    $input: DeletePracticalDrivingLessonInput!
  ) {
    drivingBookDeletePracticalDrivingLesson(input: $input) {
      success
    }
  }
`

export const EditDrivingLesson = gql`
  mutation drivingBookUpdatePracticalDrivingLesson(
    $input: UpdatePracticalDrivingLessonInput!
  ) {
    drivingBookUpdatePracticalDrivingLesson(input: $input) {
      success
    }
  }
`
