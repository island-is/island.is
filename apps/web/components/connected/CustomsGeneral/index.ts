import dynamic from 'next/dynamic'

export const CustomsGeneralAdvisories = dynamic(
  () => import('./CustomsGeneralAdvisories'),
  { ssr: false },
)

export const CustomsGeneralProhibitions = dynamic(
  () => import('./CustomsGeneralProhibitions'),
  { ssr: false },
)

export const CustomsGeneralCharges = dynamic(
  () => import('./CustomsGeneralCharges'),
  { ssr: false },
)

export const CustomsGeneralPermits = dynamic(
  () => import('./CustomsGeneralPermits'),
  { ssr: false },
)

export const CustomsGeneralTariffs = dynamic(
  () => import('./CustomsGeneralTariffs'),
  { ssr: false },
)

export const CustomsGeneralExemptions = dynamic(
  () => import('./CustomsGeneralExemptions'),
  { ssr: false },
)

export const CustomsGeneralDeliveryTerms = dynamic(
  () => import('./CustomsGeneralDeliveryTerms'),
  { ssr: false },
)

export const CustomsGeneralTransportModes = dynamic(
  () => import('./CustomsGeneralTransportModes'),
  { ssr: false },
)

export const CustomsGeneralStorageLocations = dynamic(
  () => import('./CustomsGeneralStorageLocations'),
  { ssr: false },
)

export const CustomsGeneralCosts = dynamic(
  () => import('./CustomsGeneralCosts'),
  { ssr: false },
)

export const CustomsGeneralQuantityUnits = dynamic(
  () => import('./CustomsGeneralQuantityUnits'),
  { ssr: false },
)

export const CustomsGeneralMarketAreas = dynamic(
  () => import('./CustomsGeneralMarketAreas'),
  { ssr: false },
)

export const CustomsGeneralClearanceTypes = dynamic(
  () => import('./CustomsGeneralClearanceTypes'),
  { ssr: false },
)

export const CustomsGeneralTransactionTypes = dynamic(
  () => import('./CustomsGeneralTransactionTypes'),
  { ssr: false },
)

export const CustomsGeneralCustomsProcedures = dynamic(
  () => import('./CustomsGeneralCustomsProcedures'),
  { ssr: false },
)

export const CustomsGeneralPackaging = dynamic(
  () => import('./CustomsGeneralPackaging'),
  { ssr: false },
)

export const CustomsGeneralOrigins = dynamic(
  () => import('./CustomsGeneralOrigins'),
  { ssr: false },
)

export const CustomsGeneralSelectionKeys = dynamic(
  () => import('./CustomsGeneralSelectionKeys'),
  { ssr: false },
)

export const CustomsGeneralSupplementaryDocuments = dynamic(
  () => import('./CustomsGeneralSupplementaryDocuments'),
  { ssr: false },
)

export const CustomsGeneralErrors = dynamic(
  () => import('./CustomsGeneralErrors'),
  { ssr: false },
)

export const CustomsGeneralExchangeRates = dynamic(
  () => import('./CustomsGeneralExchangeRates'),
  { ssr: false },
)

export const CustomsGeneralCountryCurrencies = dynamic(
  () => import('./CustomsGeneralCountryCurrencies'),
  { ssr: false },
)

export const CustomsGeneralAssessmentLocations = dynamic(
  () => import('./CustomsGeneralAssessmentLocations'),
  { ssr: false },
)
