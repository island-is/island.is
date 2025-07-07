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
        icd
        others
      }
      previousHealthHistory
      currentStatus
      physicalDifficulty {
        value
        explanation
      }
      mentalDifficulty {
        value
        explanation
      }
      activityParticipationDifficulty {
        value
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
