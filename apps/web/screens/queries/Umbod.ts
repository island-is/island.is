import { gql } from '@apollo/client'

export const GET_PUBLIC_AUTH_TENANTS = gql`
  query GetPublicAuthTenants {
    publicAuthTenants {
      id
      nationalId
      displayName {
        locale
        value
      }
      availableEnvironments
    }
  }
`

export const GET_PUBLIC_AUTH_TENANT_SCOPES = gql`
  query GetPublicAuthTenantScopes($tenantId: String!) {
    publicAuthTenants {
      id
      displayName {
        locale
        value
      }
    }
    publicAuthTenantScopes(tenantId: $tenantId) {
      scopeName
      displayName {
        locale
        value
      }
      description {
        locale
        value
      }
      availableEnvironments
    }
  }
`

export const GET_PUBLIC_AUTH_TENANT_SCOPES_ONLY = gql`
  query GetPublicAuthTenantScopesOnly($tenantId: String!) {
    publicAuthTenantScopes(tenantId: $tenantId) {
      scopeName
      displayName {
        locale
        value
      }
      description {
        locale
        value
      }
    }
  }
`
