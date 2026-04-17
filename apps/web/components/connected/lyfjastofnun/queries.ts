import gql from 'graphql-tag'

export const GET_PHARMACIES = gql`
  query getPharmacies {
    icelandicMedicinesAgencyPharmacies {
      data {
        id
        name
        address
        postalCode
        city
        phone
        fax
        email
        licenseHolder
        region
        operator {
          name
          address
          postalCode
          city
          phone
          nationalId
        }
        branches {
          name
          address
          postalCode
          city
          phone
          fax
          email
          category
        }
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`
