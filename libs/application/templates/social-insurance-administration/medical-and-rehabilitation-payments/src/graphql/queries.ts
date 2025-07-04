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
      applicantEmploymentStatus {
        value
        name
        display
      }
      followUpEvaluation {
        rehabilitationProgress {
          value
          name
          display
        }
        rehabilitationProgressDetails
        rehabilitationMeasuresProgress {
          value
          name
          display
        }
        rehabilitationMeasuresProgressDetails
        rehabilitationChanges {
          value
          name
          display
        }
        rehabilitationChangesDetails
        applicantCircumstancesChanges {
          value
          name
          display
        }
        applicantCircumstancesChangesDetails
      }
      comprehensiveEvaluation {
        evaluationScale {
          value
          name
          display
        }
        learningAndApplyingKnowledge
        generalTasksAndDemands
        communicationAndRelationships
        mobility
        selfCare
        domesticLife
        mainDailyLifeAreas
        leisureAndHobbies
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
