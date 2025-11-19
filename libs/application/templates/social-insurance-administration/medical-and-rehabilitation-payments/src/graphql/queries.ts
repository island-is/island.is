import gql from 'graphql-tag'

export const siaRehabilitationPlanQuery = gql`
  query SiaRehabilitationPlan {
    socialInsuranceRehabilitationPlan {
      referenceId
      serviceProvider {
        serviceProviderName
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
        expression
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
      typeAppliedFor
    }
  }
`

export const siaCertificateForSicknessAndRehabilitationQuery = gql`
  query SiaCertificateForSicknessAndRehabilitation {
    socialInsuranceCertificateForSicknessAndRehabilitation {
      referenceId
      isAlmaCertificate
      doctor {
        name
        doctorNumber
        residence
      }
      lastExaminationDate
      certificateDate
      disabilityDate
      diagnoses {
        icd {
          code
          displayValue
          category
        }
        others {
          code
          displayValue
          category
        }
      }
      previousHealthHistory
      currentStatus
      physicalDifficulty {
        value
        displayValue
        explanation
      }
      mentalDifficulty {
        value
        displayValue
        explanation
      }
      activityParticipationDifficulty {
        value
        displayValue
        explanation
      }
      other
    }
  }
`

export const siaConfirmedTreatmentQuery = gql`
  query SiaConfirmedTreatment {
    socialInsuranceConfirmedTreatment {
      referenceId
      created
      serviceProvider {
        serviceProviderName
        coordinatorTitle
        workplace
        phoneNumber
      }
      requestedTreatment {
        treatmentTypes {
          value
          name
          display
        }
        otherTreatmentDescription
      }
      previousApplication {
        hasPreviousApproval
        additionalDetails
      }
      requestedPeriod {
        startDate
        endDate
        totalRequestedMonths
      }
      typeAppliedFor
    }
  }
`

export const siaConfirmationOfPendingResolutionQuery = gql`
  query SiaConfirmationOfPendingResolution {
    socialInsuranceConfirmationOfPendingResolution {
      referenceId
      created
      serviceProvider {
        serviceProviderName
        coordinatorTitle
        workplace
        phoneNumber
      }
      requestedTreatment {
        treatmentTypes {
          value
          name
          display
        }
        otherTreatmentDescription
      }
      treatmentExplanation
      previousApplication {
        hasPreviousApproval
        additionalDetails
      }
      requestedPeriod {
        startDate
        endDate
        totalRequestedMonths
      }
      typeAppliedFor
    }
  }
`

export const siaConfirmationOfIllHealthQuery = gql`
  query SiaConfirmationOfIllHealth {
    socialInsuranceConfirmationOfIllHealth {
      referenceId
      created
      serviceProvider {
        serviceProviderName
        coordinatorTitle
        workplace
        phoneNumber
      }
      currentMedicalStatus
      previousApplication {
        hasPreviousApproval
        additionalDetails
      }
      requestedPeriod {
        startDate
        endDate
        totalRequestedMonths
      }
      typeAppliedFor
    }
  }
`
