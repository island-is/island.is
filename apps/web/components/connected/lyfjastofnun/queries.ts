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

export const GET_MEDICAL_CLINICS = gql`
  query getMedicalClinics {
    icelandicMedicinesAgencyMedicalClinics {
      data {
        id
        name
        address
        postalCode
        city
        phone
        fax
        email
        region
        operator {
          name
          address
          postalCode
          city
          phone
          nationalId
        }
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`

export const GET_WHOLESALERS = gql`
  query getWholesalers {
    icelandicMedicinesAgencyWholesalers {
      data {
        id
        name
        address
        postalCode
        city
        phone
        fax
        email
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`
