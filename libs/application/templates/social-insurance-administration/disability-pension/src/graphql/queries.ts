import gql from 'graphql-tag'

export const siaDisabilityPensionCertificateQuery = gql`
  query SiaDisabilityPensionCertificate {
    socialInsuranceDisabilityPensionCertificate {
      referenceId
      doctor {
        name
        doctorNumber
        phoneNumber
        email
        residence
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

export const siaGeneralCurrenciesQuery = gql`
  query SocialInsuranceGeneralCurrencies {
    socialInsuranceGeneral {
      currencies
    }
  }
`

export const siaGeneralLanguagesQuery = gql`
  query SocialInsuranceGeneralLanguages {
    socialInsuranceGeneral {
      languages {
        value
        label
      }
    }
  }
`

export const siaGeneralProfessionsQuery = gql`
  query SocialInsuranceGeneralProfessions {
    socialInsuranceGeneral {
      professions {
        value
        label
        needsFurtherInformation
      }
    }
  }
`

export const siaGeneralProfessionActivitiesQuery = gql`
  query SocialInsuranceGeneralProfessionActivities {
    socialInsuranceGeneral {
      professionActivities {
        value
        label
        needsFurtherInformation
      }
    }
  }
`
