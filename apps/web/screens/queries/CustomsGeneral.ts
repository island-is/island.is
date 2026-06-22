import gql from 'graphql-tag'

export const GET_CUSTOMS_GENERAL_ADVISORIES = gql`
  query CustomsGeneralAdvisories($input: CustomsGeneralInput!) {
    customsGeneralAdvisories(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_PROHIBITIONS = gql`
  query CustomsGeneralProhibitions($input: CustomsGeneralInput!) {
    customsGeneralProhibitions(input: $input) {
      code
      name
      description
      validFrom
      validTo
      exemptionProvider
    }
  }
`

export const GET_CUSTOMS_GENERAL_CHARGES = gql`
  query CustomsGeneralCharges($input: CustomsGeneralInput!) {
    customsGeneralCharges(input: $input) {
      code
      name
      description
      validFrom
      validTo
      taxtiUpphaed
      taxtiProsenta
      alagsgrunnur
    }
  }
`

export const GET_CUSTOMS_GENERAL_PERMITS = gql`
  query CustomsGeneralPermits($input: CustomsGeneralInput!) {
    customsGeneralPermits(input: $input) {
      code
      name
      description
      validFrom
      validTo
      leyfiVeitir
    }
  }
`

export const GET_CUSTOMS_GENERAL_TARIFFS = gql`
  query CustomsGeneralTariffs($input: CustomsGeneralInput!) {
    customsGeneralTariffs(input: $input) {
      name
      description
      validFrom
      validTo
    }
  }
`

export const GET_CUSTOMS_GENERAL_EXEMPTIONS = gql`
  query CustomsGeneralExemptions($input: CustomsGeneralInput!) {
    customsGeneralExemptions(input: $input) {
      code
      name
      description
      legalArticle
      system
    }
  }
`

export const GET_CUSTOMS_GENERAL_DELIVERY_TERMS = gql`
  query CustomsGeneralDeliveryTerms($input: CustomsGeneralInput!) {
    customsGeneralDeliveryTerms(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_TRANSPORT_MODES = gql`
  query CustomsGeneralTransportModes($input: CustomsGeneralInput!) {
    customsGeneralTransportModes(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_STORAGE_LOCATIONS = gql`
  query CustomsGeneralStorageLocations($input: CustomsGeneralDagsInput!) {
    customsGeneralStorageLocations(input: $input) {
      nationalId
      code
      companyName
      location
    }
  }
`

export const GET_CUSTOMS_GENERAL_COSTS = gql`
  query CustomsGeneralCosts($input: CustomsGeneralInput!) {
    customsGeneralCosts(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_QUANTITY_UNITS = gql`
  query CustomsGeneralQuantityUnits($input: CustomsGeneralInput!) {
    customsGeneralQuantityUnits(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_MARKET_AREAS = gql`
  query CustomsGeneralMarketAreas($input: CustomsGeneralInput!) {
    customsGeneralMarketAreas(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_CLEARANCE_TYPES = gql`
  query CustomsGeneralClearanceTypes($input: CustomsGeneralInput!) {
    customsGeneralClearanceTypes(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_TRANSACTION_TYPES = gql`
  query CustomsGeneralTransactionTypes($input: CustomsGeneralInput!) {
    customsGeneralTransactionTypes(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_CUSTOMS_PROCEDURES = gql`
  query CustomsGeneralCustomsProcedures($input: CustomsGeneralInput!) {
    customsGeneralCustomsProcedures(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_PACKAGING = gql`
  query CustomsGeneralPackaging($input: CustomsGeneralInput!) {
    customsGeneralPackaging(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_ORIGINS = gql`
  query CustomsGeneralOrigins($input: CustomsGeneralDagsInput!) {
    customsGeneralOrigins(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_SELECTION_KEYS = gql`
  query CustomsGeneralSelectionKeys($input: CustomsGeneralInput!) {
    customsGeneralSelectionKeys(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_SUPPLEMENTARY_DOCUMENTS = gql`
  query CustomsGeneralSupplementaryDocuments($input: CustomsGeneralInput!) {
    customsGeneralSupplementaryDocuments(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_ERRORS = gql`
  query CustomsGeneralErrors($input: CustomsGeneralInput!) {
    customsGeneralErrors(input: $input) {
      code
      name
      description
    }
  }
`

export const GET_CUSTOMS_GENERAL_EXCHANGE_RATES = gql`
  query CustomsGeneralExchangeRates($input: CustomsGeneralInput!) {
    customsGeneralExchangeRates(input: $input) {
      code
      name
      rate
    }
  }
`

export const GET_CUSTOMS_GENERAL_COUNTRY_CURRENCIES = gql`
  query CustomsGeneralCountryCurrencies($input: CustomsGeneralDagsInput!) {
    customsGeneralCountryCurrencies(input: $input) {
      countryCode
      countryName
      currencyCode
      currencyName
    }
  }
`

export const GET_CUSTOMS_GENERAL_TARIFF_KEYS = gql`
  query CustomsGeneralTariffKeys($input: CustomsGeneralInput!) {
    customsGeneralTariffKeys(input: $input) {
      version
      description
      periodFrom
      periodTo
      jsonUrl
      textUrl
    }
  }
`

export const GET_CUSTOMS_GENERAL_ASSESSMENT_LOCATIONS = gql`
  query CustomsGeneralAssessmentLocations {
    customsGeneralAssessmentLocations {
      countryCode
      location
      locationName
    }
  }
`
