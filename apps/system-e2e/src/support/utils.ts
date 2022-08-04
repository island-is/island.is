import { gql } from '@apollo/client'

export const cypressError = (msg: string) => {
  throw new Error(msg)
}

export const getCognitoCredentials = () => {
  return {
    cognitoUsername:
      process.env.AWS_COGNITO_USERNAME ||
      cypressError('AWS_COGNITO_USERNAME env variable missing'),
    cognitoPassword:
      process.env.AWS_COGNITO_PASSWORD ||
      cypressError('AWS_COGNITO_PASSWORD env variable missing'),
  }
}

export const testEnvironment = process.env.TEST_ENVIRONMENT || 'local'

export const getApplicationQuery = (id: string) => {
  return {
    query: `{
      applicationApplication(input: { id: "${id}" }, locale: "is") {
        id
        created
        modified
        applicant
        assignees
        applicantActors
        state
        typeId
        answers
        externalData
        name
        institution
        progress
        status
      }
    }`,
  }
}
