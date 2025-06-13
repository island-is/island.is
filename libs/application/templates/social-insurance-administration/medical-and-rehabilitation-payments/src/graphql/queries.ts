import gql from 'graphql-tag'

export const siaRehabilitationPlanQuery = gql`
  query SiaRehabilitationPlan {
    socialInsuranceRehabilitationPlan {
      serviceProvider {
        serviceProviderName
        coordinatorName
        coordinatorTitle
        workplace
        phoneNumber
      }
      startDate
      plannedEndDate
      rehabilitationFocusAndStrategy
      physicalHealthGoals {
        goalDescription
        measures
      }
      mentalHealthGoals {
        goalDescription
        measures
      }
      activityAndParticipationGoals {
        goalDescription
        measures
      }
    }
  }
`
