import gql from 'graphql-tag'

export const GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY = gql`
  query GetBrokenDownElectronicRegistrationStatistics(
    $input: GetBrokenDownElectronicRegistrationStatisticsInput!
  ) {
    getBrokenDownElectronicRegistrationStatistics(input: $input) {
      electronicRegistrationStatisticBreakdown {
        periodIntervalName
        totalRegistrationForCurrentPeriodInterval
        totalPaperRegistrationsForCurrentPeriodInterval
        totalElectronicRegistrationsForCurrentPeriodInterval
        totalManualRegistrationsForCurrentPeriodInterval
        registrationTypes {
          registrationType
          totalRegistrationsOfType
          totalPaperRegistrationsOfType
          totalElectronicRegistrationsOfType
          totalManualRegistrationsOfType
        }
      }
    }
  }
`
