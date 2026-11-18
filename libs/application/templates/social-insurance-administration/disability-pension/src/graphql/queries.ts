import gql from 'graphql-tag'

export const siaDisabilityPensionCertificateQuery = gql`
  query SiaDisabilityPensionCertificate(
    $locale: String!
    $applicationId: String
  ) {
    socialInsuranceDisabilityPensionCertificate(
      locale: $locale
      applicationId: $applicationId
    ) {
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
  query SocialInsuranceGeneralCurrencies($applicationId: String) {
    socialInsuranceGeneral {
      currencies(applicationId: $applicationId)
    }
  }
`

export const siaGeneralLanguagesQuery = gql`
  query SocialInsuranceGeneralLanguages($applicationId: String) {
    socialInsuranceGeneral {
      languages(applicationId: $applicationId) {
        value
        label
      }
    }
  }
`

export const siaGeneralProfessionsQuery = gql`
  query SocialInsuranceGeneralProfessions($applicationId: String) {
    socialInsuranceGeneral {
      professions(applicationId: $applicationId) {
        value
        label
        needsFurtherInformation
      }
    }
  }
`

export const siaGeneralProfessionActivitiesQuery = gql`
  query SocialInsuranceGeneralProfessionActivities($applicationId: String) {
    socialInsuranceGeneral {
      professionActivities(applicationId: $applicationId) {
        value
        label
        needsFurtherInformation
      }
    }
  }
`
