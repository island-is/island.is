import gql from 'graphql-tag'

export const siaRehabilitationPlanQuery = gql`
  query SiaRehabilitationPlan {
    siaGetRehabilitationPlan {
      person {
        name
        nationalId
        address
        postalCode
        city
        phoneNumber
        email
      }
      serviceProvider {
        serviceProviderName
        coordinatorName
        coordinatorNationalId
        coordinatorTitle
        workplace
        phoneNumber
        email
      }
      applicantEmploymentStatus
      firstEvaluation {
        applicantStatus
        previousMedicalOrRehab
        attitudeTowardsWork
      }
      followUpEvaluation {
        rehabilitationProgress
        rehabilitationProgressDetails
        rehabilitationMeasuresProgress
        rehabilitationMeasuresProgressDetails
        rehabilitationChanges
        rehabilitationChangesDetails
        applicantCircumstancesChanges
        applicantCircumstancesChangesDetails
      }
      comprehensiveEvaluation {
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
