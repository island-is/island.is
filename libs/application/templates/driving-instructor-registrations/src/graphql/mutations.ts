import gql from 'graphql-tag'

export const RegisterDrivingLesson = gql`
  mutation createPracticalDrivingLesson(
    $input: CreatePracticalDrivingLessonInput!
  ) {
    createPracticalDrivingLesson(input: $input) {
      data {
        id
      }
    }
  }
`
export const DeleteDrivingLesson = gql`
  mutation deletePracticalDrivingLesson(
    $input: DeletePracticalDrivingLessonInput!
  ) {
    deletePracticalDrivingLesson(input: $input) {
      success
    }
  }
`

export const EditDrivingLesson = gql`
  mutation updatePracticalDrivingLesson(
    $input: UpdatePracticalDrivingLessonInput!
  ) {
    updatePracticalDrivingLesson(input: $input) {
      success
    }
  }
`
