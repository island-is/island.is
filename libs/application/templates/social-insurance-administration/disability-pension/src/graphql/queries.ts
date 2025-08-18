import gql from 'graphql-tag'

export const siaDisabilityPensionCertificate = gql`
  query SiaDisabilityPensionCertificate {
    socialInsuranceDisabilityPensionCertificate {
      referenceId
      doctor {
        name
        doctorNumber
        residence
        email
        phoneNumber
      }
      lastInspectionDate
      certificateDate
      dateOfWorkIncapacity
      diagnoses {
        mainDiagnoses {
          code
          description
        }
        otherDiagnoses {
          code
          description
        }
      }
      healthHistorySummary
      healthImpact {
        description
        impactLevel
      }
      participationLimitationCause
      abilityChangePotential
      medicationAndSupports
      assessmentToolsUsed
      physicalAbilityRatings {
        type
        score
      }
      cognitiveAndMentalAbilityRatings {
        type
        score
      }
      functionalAssessment {
        type
        score
      }
      impairments {
        type
        functions {
          title
          keyNumber
          description
        }
      }
      environmentalFactors {
        category
        keyNumber
        description
      }
    }
  }
`
