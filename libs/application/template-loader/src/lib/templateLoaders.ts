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
  [ApplicationTypes.STRAUMURINN]: () =>
    import('@island.is/application/templates/straumurinn-application'),
  [ApplicationTypes.X_ROAD]: () =>
    import('@island.is/application/templates/x-road-application'),
  [ApplicationTypes.CHILDREN_DOMICILE_TRANSFER]: () =>
    import('@island.is/application/templates/children-domicile-transfer'),
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: () =>
    import('@island.is/application/templates/children-residence-change'),
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: () =>
    import('@island.is/application/templates/data-protection-complaint'),
  [ApplicationTypes.PARTY_LETTER]: () =>
    import('@island.is/application/templates/party-letter'),
}

export default templates
