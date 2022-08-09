import gql from 'graphql-tag'

export const GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY = gql`
  query GetBrokenDownElectronicRegistrationStatistics(
    $input: GetBrokenDownElectronicRegistrationStatisticsInput!
  ) {
    getBrokenDownElectronicRegistrationStatistics(input: $input) {
      periodIntervalName
      totalRegistrationForCurrentPeriodInterval
      totalPaperRegistrationsForCurrentPeriodInterval
      totalElectronicRegistrationsForCurrentPeriodInterval
      registrationTypes {
        registrationType
        totalRegistrationsOfType
        totalPaperRegistrationsOfType
        totalElectronicRegistrationsOfType
      }
    }
  }
`
