import gql from 'graphql-tag'

export const siaRehabilitationPlanQuery = gql`
  query SiaRehabilitationPlan {
    socialInsuranceRehabilitationPlan {
      referenceId
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

export const siaCertificateForSicknessAndRehabilitationQuery = gql`
  query SiaCertificateForSicknessAndRehabilitation {
    socialInsuranceCertificateForSicknessAndRehabilitation {
      referenceId
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
      confirmation {
        type {
          value
          name
          display
        }
        typeName
        treatmentMeasures
        explanation
        progress
        estimatedDuration {
          start
          end
          months
        }
      }
    }
  }
`

export const siaConfirmedTreatmentQuery = gql`
  query SiaConfirmedTreatment {
    socialInsuranceConfirmedTreatment {
      referenceId
      caseManager {
        name
        jobTitle
        workplace
      }
      confirmationDate
      previousTreatment {
        description
        application
        type {
          value
          name
          display
        }
        other
        content
      }
      treatmentPlan {
        applicationType
        treatmentType {
          value
          name
          display
        }
        explanation
        discharge
        plannedFollowup
      }
      treatmentType
      estimatedDuration {
        start
        end
        months
      }
    }
  }
`

export const siaConfirmationOfPendingResolutionQuery = gql`
  query SiaConfirmationOfPendingResolution {
    socialInsuranceConfirmationOfPendingResolution {
      referenceId
      serviceProvider {
        serviceProviderName
        coordinatorName
        coordinatorTitle
        workplace
        phoneNumber
      }
      requestedTreatment {
        treatmentType {
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
    }
  }
`

export const siaConfirmationOfIllHealthQuery = gql`
  query SiaConfirmationOfIllHealth {
    socialInsuranceConfirmationOfIllHealth {
      referenceId
      serviceProvider {
        serviceProviderName
        coordinatorName
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
    }
  }
`
