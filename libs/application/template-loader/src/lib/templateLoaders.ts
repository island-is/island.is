import { ApplicationTypes } from '@island.is/application/types'

const templates: Record<ApplicationTypes, () => Promise<unknown>> = {
  [ApplicationTypes.EXAMPLE]: () =>
    import('@island.is/application/templates/reference-template'),
  [ApplicationTypes.ESTATE]: () =>
    import('@island.is/application/templates/estate'),
  [ApplicationTypes.PARENTAL_LEAVE]: () =>
    import('@island.is/application/templates/parental-leave'),
  [ApplicationTypes.DRIVING_LEARNERS_PERMIT]: () =>
    import('@island.is/application/templates/driving-learners-permit'),
  [ApplicationTypes.DRIVING_LICENSE]: () =>
    import('@island.is/application/templates/driving-license'),
  [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]: () =>
    import('@island.is/application/templates/driving-assessment-approval'),
  [ApplicationTypes.PASSPORT]: () =>
    import('@island.is/application/templates/passport'),
  [ApplicationTypes.PASSPORT_ANNULMENT]: () =>
    import('@island.is/application/templates/passport-annulment'),
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: () =>
    import('@island.is/application/templates/document-provider-onboarding'),
  [ApplicationTypes.HEALTH_INSURANCE]: () =>
    import('@island.is/application/templates/health-insurance'),
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: () =>
    import('@island.is/application/templates/children-residence-change'),
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: () =>
    import('@island.is/application/templates/children-residence-change-v2'),
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: () =>
    import('@island.is/application/templates/data-protection-complaint'),
  [ApplicationTypes.LOGIN_SERVICE]: () =>
    import('@island.is/application/templates/login-service'),
  [ApplicationTypes.INHERITANCE_REPORT]: () =>
    import('@island.is/application/templates/inheritance-report'),
  [ApplicationTypes.INSTITUTION_COLLABORATION]: () =>
    import('@island.is/application/templates/institution-collaboration'),
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: () =>
    import('@island.is/application/templates/funding-government-projects'),
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: () =>
    import('@island.is/application/templates/public-debt-payment-plan'),
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]: () =>
    import('@island.is/application/templates/complaints-to-althingi-ombudsman'),
  [ApplicationTypes.ACCIDENT_NOTIFICATION]: () =>
    import('@island.is/application/templates/accident-notification'),
  [ApplicationTypes.GENERAL_PETITION]: () =>
    import('@island.is/application/templates/general-petition'),
  [ApplicationTypes.GENERAL_FISHING_LICENSE]: () =>
    import('@island.is/application/templates/general-fishing-license'),
  [ApplicationTypes.P_SIGN]: () =>
    import('@island.is/application/templates/p-sign'),
  [ApplicationTypes.ANNOUNCEMENT_OF_DEATH]: () =>
    import('@island.is/application/templates/announcement-of-death'),
  [ApplicationTypes.CRIMINAL_RECORD]: () =>
    import('@island.is/application/templates/criminal-record'),
  [ApplicationTypes.FINANCIAL_AID]: () =>
    import('@island.is/application/templates/financial-aid'),
  [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]: () =>
    import('@island.is/application/templates/driving-instructor-registrations'),
  [ApplicationTypes.EXAMPLE_PAYMENT]: () =>
    import('@island.is/application/templates/example-payment'),
  [ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]: () =>
    import('@island.is/application/templates/driving-school-confirmation'),
  [ApplicationTypes.MORTGAGE_CERTIFICATE]: () =>
    import('@island.is/application/templates/mortgage-certificate'),
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: () =>
    import('@island.is/application/templates/no-debt-certificate'),
  [ApplicationTypes.FINANCIAL_STATEMENTS_INAO]: () =>
    import('@island.is/application/templates/financial-statements-inao'),
  [ApplicationTypes.OPERATING_LCENSE]: () =>
    import('@island.is/application/templates/operating-license'),
  [ApplicationTypes.MARRIAGE_CONDITIONS]: () =>
    import('@island.is/application/templates/marriage-conditions'),
  [ApplicationTypes.DRIVING_LICENSE_DUPLICATE]: () =>
    import('@island.is/application/templates/driving-license-duplicate'),
  [ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY]: () =>
    import(
      '@island.is/application/templates/transport-authority/anonymity-in-vehicle-registry'
    ),
  [ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE]: () =>
    import(
      '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
    ),
  [ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE]: () =>
    import(
      '@island.is/application/templates/transport-authority/change-operator-of-vehicle'
    ),
  [ApplicationTypes.DIGITAL_TACHOGRAPH_COMPANY_CARD]: () =>
    import(
      '@island.is/application/templates/transport-authority/digital-tachograph-company-card'
    ),
  [ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD]: () =>
    import(
      '@island.is/application/templates/transport-authority/digital-tachograph-drivers-card'
    ),
  [ApplicationTypes.DIGITAL_TACHOGRAPH_WORKSHOP_CARD]: () =>
    import(
      '@island.is/application/templates/transport-authority/digital-tachograph-workshop-card'
    ),
  [ApplicationTypes.LICENSE_PLATE_RENEWAL]: () =>
    import(
      '@island.is/application/templates/transport-authority/license-plate-renewal'
    ),
  [ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE]: () =>
    import(
      '@island.is/application/templates/transport-authority/order-vehicle-license-plate'
    ),
  [ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE]: () =>
    import(
      '@island.is/application/templates/transport-authority/order-vehicle-registration-certificate'
    ),
  [ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP]: () =>
    import(
      '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
    ),
  [ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR]: () =>
    import(
      '@island.is/application/templates/driving-license-book-update-instructor'
    ),
  [ApplicationTypes.ALCOHOL_TAX_REDEMPTION]: () =>
    import('@island.is/application/templates/alcohol-tax-redemption'),
  [ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD]: () =>
    import('@island.is/application/templates/european-health-insurance-card'),
  [ApplicationTypes.OLD_AGE_PENSION]: () =>
    import(
      '@island.is/application/templates/social-insurance-administration/old-age-pension'
    ),
  [ApplicationTypes.SIGNATURE_LIST_CREATION]: () =>
    import(
      '@island.is/application/templates/signature-collection/signature-list-creation'
    ),
  [ApplicationTypes.SIGNATURE_LIST_SIGNING]: () =>
    import(
      '@island.is/application/templates/signature-collection/signature-list-signing'
    ),
  [ApplicationTypes.CITIZENSHIP]: () =>
    import(
      '@island.is/application/templates/directorate-of-immigration/citizenship'
    ),
}

export default templates
