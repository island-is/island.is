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
      invoiceTypes {
        totalCount
        data {
          id
          name
          description
          code
        }
        pageInfo {
          __typename
          hasNextPage
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
      totalCount
      data {
        id
        supplier {
          id
          name
        }
        customer {
          id
          name
        }
        totalPaymentsSum
        totalPaymentsCount
      }
      pageInfo {
        __typename
        hasNextPage
      }
    }
  }
`
