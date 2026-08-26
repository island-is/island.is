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
  query IcelandicGovernmentInstitutionsInvoicePaymentsGroup(
    $input: IcelandicGovernmentInstitutionsInvoicePaymentsGroupInput!
  ) {
    icelandicGovernmentInstitutionsInvoicePaymentsGroup(input: $input) {
      id
      supplier {
        id
        name
        isConfidential
        isPrivatePerson
        isPrivatePersonProxy
      }
      debtor {
        id
        legalId
        name
      }
      payments {
        id
        date
        amount
        invoice {
          id
          number
          totalAmount
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
  }
`

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUPS = gql`
  query IcelandicGovernmentInstitutionsInvoicePaymentsGroups(
    $input: IcelandicGovernmentInstitutionsInvoicePaymentsGroupsInput!
  ) {
    icelandicGovernmentInstitutionsInvoicePaymentsGroups(input: $input) {
      totalPaymentsSum
      totalPaymentsCount
      data {
        id
        supplier {
          id
          name
          isConfidential
          isPrivatePerson
          isPrivatePersonProxy
        }
        debtor {
          id
          legalId
          name
        }
        totalPaymentsSum
        totalPaymentsCount
      }
      totalCount
      pageInfo {
        __typename
        hasNextPage
      }
    }
  }
`
