import gql from 'graphql-tag'

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_MINISTRIES = gql`
  query IcelandicGovernmentInstitutionsMinistries(
    $search: String
    $after: String
    $lookup: [String!]
    $sortDirection: IcelandicGovernmentInstitutionsSortDirection
  ) {
    icelandicGovernmentInstitutionsMinistries(
      input: {
        search: $search
        after: $after
        lookup: $lookup
        sortDirection: $sortDirection
      }
    ) {
      data {
        id
        name
      }
      totalCount
      pageInfo {
        __typename
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_SUPPLIERS = gql`
  query IcelandicGovernmentInstitutionsSuppliers(
    $search: String
    $after: String
    $lookup: [String!]
    $sortDirection: IcelandicGovernmentInstitutionsSortDirection
  ) {
    icelandicGovernmentInstitutionsSuppliers(
      input: {
        search: $search
        after: $after
        lookup: $lookup
        sortDirection: $sortDirection
      }
    ) {
      data {
        id
        name
      }
      totalCount
      pageInfo {
        __typename
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_DEBTORS = gql`
  query IcelandicGovernmentInstitutionsDebtors(
    $search: String
    $after: String
    $lookup: [String!]
    $sortDirection: IcelandicGovernmentInstitutionsSortDirection
  ) {
    icelandicGovernmentInstitutionsDebtors(
      input: {
        search: $search
        after: $after
        lookup: $lookup
        sortDirection: $sortDirection
      }
    ) {
      data {
        id
        name
      }
      totalCount
      pageInfo {
        __typename
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_PAYMENT_TYPES = gql`
  query IcelandicGovernmentInstitutionsInvoicePaymentTypes(
    $search: String
    $after: String
    $lookup: [String!]
    $sortDirection: IcelandicGovernmentInstitutionsSortDirection
  ) {
    icelandicGovernmentInstitutionsInvoicePaymentTypes(
      input: {
        search: $search
        after: $after
        lookup: $lookup
        sortDirection: $sortDirection
      }
    ) {
      data {
        id
        name
      }
      totalCount
      pageInfo {
        __typename
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUP = gql`
  query IcelandicGovernmentInstitutionsInvoiceGroup(
    $input: IcelandicGovernmentInstitutionsInvoiceGroupInput!
  ) {
    icelandicGovernmentInstitutionsInvoiceGroup(input: $input) {
      id
      supplier {
        id
        name
        isConfidential
        isPrivateProxy
      }
      debtor {
        id
        legalId
        name
      }
      invoices {
        id
        date
        totalItemizationAmount
        itemizations {
          id
          label
          invoicePaymentType {
            id
            name
          }
          amount
        }
      }
    }
  }
`

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS = gql`
  query IcelandicGovernmentInstitutionsInvoiceGroups(
    $input: IcelandicGovernmentInstitutionsInvoiceGroupsInput!
  ) {
    icelandicGovernmentInstitutionsInvoiceGroups(input: $input) {
      totalPaymentsSum
      totalPaymentsCount
      data {
        id
        supplier {
          id
          name
          isConfidential
          isPrivateProxy
        }
        debtor {
          id
          legalId
          name
        }
        totalSum
        totalCount
      }
      totalCount
      pageInfo {
        __typename
        hasNextPage
      }
    }
  }
`
