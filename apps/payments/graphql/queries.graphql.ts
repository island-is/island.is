import gql from 'graphql-tag'

export const GetOrganization = gql`
  query getOrganizationByNationalId($input: GetOrganizationByNationalIdInput!) {
    getOrganizationByNationalId(input: $input) {
      id
      title
      shortTitle
      logo {
        url
        title
      }
    }
  }
`

export const GetPaymentFlow = gql`
  query getPaymentFlow($input: GetPaymentFlowInput!) {
    paymentsGetFlow(input: $input) {
      id
      paymentStatus
      productTitle
      productPrice
      payerNationalId
      payerName
      existingInvoiceId
      availablePaymentMethods
      organisationId
      metadata
      returnUrl
      cancelUrl
      redirectToReturnUrlOnSuccess
      updatedAt
    }
  }
`

export const GetVerificationStatus = gql`
  query getVerificationStatus($input: GetPaymentFlowInput!) {
    paymentsGetVerificationStatus(input: $input) {
      isVerified
    }
  }
`

export const GetJwks = gql`
  query getJwks {
    paymentsGetJwks {
      keys {
        kty
        n
        e
        kid
        use
        alg
      }
    }
  }
`

export const GetApplePaySession = gql`
  query getApplePaySession {
    paymentsGetApplePaySession {
      session
    }
  }
`
