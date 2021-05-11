import { ApplicationTypes } from '@island.is/application/core'

const templates: Record<ApplicationTypes, () => Promise<unknown>> = {
  [ApplicationTypes.EXAMPLE]: () =>
    import('@island.is/application/templates/reference-template'),
  [ApplicationTypes.PARENTAL_LEAVE]: () =>
    import('@island.is/application/templates/parental-leave'),
  [ApplicationTypes.DRIVING_LESSONS]: () =>
    import('@island.is/application/templates/driving-lessons'),
  [ApplicationTypes.DRIVING_LICENSE]: () =>
    import('@island.is/application/templates/driving-license'),
  [ApplicationTypes.PASSPORT]: () =>
    import('@island.is/application/templates/passport'),
  [ApplicationTypes.META_APPLICATION]: () =>
    import('@island.is/application/templates/meta-application'),
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: () =>
    import('@island.is/application/templates/document-provider-onboarding'),
  [ApplicationTypes.HEALTH_INSURANCE]: () =>
    import('@island.is/application/templates/health-insurance'),
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: () =>
    import(
      '@island.is/application/templates/family-matters/children-residence-change'
    ),
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: () =>
    import('@island.is/application/templates/data-protection-complaint'),
  [ApplicationTypes.PARTY_LETTER]: () =>
    import('@island.is/application/templates/party-letter'),
  [ApplicationTypes.LOGIN_SERVICE]: () =>
    import('@island.is/application/templates/login-service'),
  [ApplicationTypes.PARTY_APPLICATION]: () =>
    import('@island.is/application/templates/party-application'),
  [ApplicationTypes.INSTITUTION_COLLABORATION]: () =>
    import('@island.is/application/templates/institution-collaboration'),
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: () =>
    import('@island.is/application/templates/funding-government-projects'),
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: () =>
    import('@island.is/application/templates/public-debt-payment-plan'),
  [ApplicationTypes.JOINT_CUSTODY_AGREEMENT]: () =>
    import(
      '@island.is/application/templates/family-matters/joint-custody-agreement'
    ),
}

export default templates
