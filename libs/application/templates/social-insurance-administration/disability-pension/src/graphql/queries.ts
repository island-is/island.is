import gql from 'graphql-tag'

export const siaDisabilityPensionCertificateQuery = gql`
  query SiaDisabilityPensionCertificate($locale: String!) {
    socialInsuranceDisabilityPensionCertificate(locale: $locale) {
      referenceId
      doctor {
        name
        residence
      }
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
      participationLimitationCause
      stabilityOfHealth {
        description
        furtherDetails
      }
      abilityChangePotential
      medicationAndSupportsUsed {
        medicationUsed
        supportsUsed
        interventionsUsed
      }
      capacityForWork
      previousRehabilitation
      physicalImpairments {
        title
        value
      }
      mentalImpairments {
        title
        value
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
