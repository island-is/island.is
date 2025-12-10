import { gql } from '@apollo/client'

export const VALIDATE_INSTRUCTOR_QUERY = gql`
  query ValidateInstructor($input: ValidateInstructorInput!) {
    validateInstructor(input: $input) {
      name
      nationalId
      categoriesMayTeach
    }
  }
`

export const EXAMINEE_ELIGIBILITY_QUERY = gql`
  query ExamineeEligibility($input: ExamineeEligibilityInput!) {
    getExamineeEligibility(input: $input) {
      nationalId
      isEligible
      errorMsg
      errorMsgEn
    }
  }
`

export const EXAMINEE_VALIDATION_QUERY = gql`
  query ExamineeValidation($input: ExamineeValidationInput!) {
    getExamineeValidation(input: $input) {
      nationalId
      examCategories
      doesntHaveToPayLicenseFee
      isValid
      errorMessage
      errorMessageEn
    }
  }
`

export const IS_COMPANY_VALID_QUERY = gql`
  query IsCompanyValid($nationalId: String!) {
    practicalExamIsCompanyValid(nationalId: $nationalId) {
      nationalId
      mayPayReceiveInvoice
    }
  }
`
