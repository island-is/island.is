import gql from 'graphql-tag'

export const siaDisabilityPensionCertificate = gql`
  query SiaDisabilityPensionCertificate {
    socialInsuranceDisabilityPensionCertificate {
      referenceId
      doctor {
        name
        doctorNumber
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

export const siaGeneralCountries = gql`
  query SocialInsuranceGeneralCountries {
    socialInsuranceGeneral {
      countries {
        code
        name
      }
    }
  }
`
export const siaGeneralCurrencies = gql`
  query SocialInsuranceGeneralCurrencies {
    socialInsuranceGeneral {
      currencies
    }
  }
`
export const siaGeneralProfessions = gql`
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

export const siaGeneralProfessionActivities = gql`
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
