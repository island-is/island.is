import gql from 'graphql-tag'

export const GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICES_FILTERS = gql`
  query IcelandicGovernmentInstitutionsInvoicesFilters {
    icelandicGovernmentInstitutionsInvoicesFilters {
      customers {
        totalCount
        data {
          id
          name
        }
        pageInfo {
          __typename
          hasNextPage
        }
      }
      suppliers {
        totalCount
        data {
          id
          name
        }
        pageInfo {
          __typename
          hasNextPage
        }
      }
      invoicePaymentTypes {
        totalCount
        data {
          code
          name
          isConfidential
        }
        pageInfo {
          __typename
          hasNextPage
        }
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
      customer {
        id
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
            code
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
        customer {
          id
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
