import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_SUPPORT_QNAS = gql`
  query GetSupportQNAs($input: GetSupportQNAsInput!) {
    getSupportQNAs(input: $input) {
      id
      question
      answer {
        ...AllSlices
      }
      slug
      organization {
        id
        title
        slug
      }
      category {
        title
        description
        slug
      }
      subCategory {
        title
        description
        slug
      }
    }
  }
  ${slices}
`

export const GET_SUPPORT_QNAS_IN_CATEGORY = gql`
  query GetSupportQNAsInCategory($input: GetSupportQNAsInCategoryInput!) {
    getSupportQNAsInCategory(input: $input) {
      id
      question
      slug
      subCategory {
        title
        description
        slug
      }
      category {
        description
      }
      answer {
        ...AllSlices
      }
    }
  }
  ${slices}
`

export const GET_SUPPORT_CATEGORY = gql`
  query GET_SUPPORT_CATEGORY($input: GetSupportCategoryInput!) {
    getSupportCategory(input: $input) {
      title
      description
    }
  }
`

export const GET_SUPPORT_FORM_IN_ORGANIZATION = gql`
  query GET_SUPPORT_FORM_IN_ORGANIZATION(
    $input: GetSupportFormInOrganizationInput!
  ) {
    getSupportFormInOrganization(input: $input) {
      id
      category
      form
      organization {
        slug
      }
    }
  }
`
