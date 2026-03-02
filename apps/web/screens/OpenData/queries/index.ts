import { gql } from '@apollo/client'

export const GET_OPEN_DATA_DATASETS = gql`
  query GetOpenDataDatasets($input: GetOpenDataDatasetsInput!) {
    openDataDatasets(input: $input) {
      datasets {
        id
        title
        description
        category
        publisher
        publisherId
        organizationImage
        lastUpdated
        format
        tags
        downloadUrl
        metadata {
          size
          recordCount
          updateFrequency
        }
      }
      total
      page
      limit
      hasMore
    }
  }
`

export const GET_OPEN_DATA_DATASET = gql`
  query GetOpenDataDataset($id: ID!) {
    openDataDataset(id: $id) {
      id
      title
      description
      category
      publisher
      publisherId
      organizationImage
      lastUpdated
      format
      tags
      downloadUrl
      license
      maintainer
      maintainerEmail
      author
      authorEmail
      resources {
        id
        name
        format
        url
        size
        lastModified
        license
      }
      metadata {
        size
        recordCount
        updateFrequency
      }
    }
  }
`

export const GET_OPEN_DATA_FILTERS = gql`
  query GetOpenDataFilters {
    openDataFilters {
      id
      field
      label
      options {
        value
        label
        count
      }
    }
  }
`

export const GET_OPEN_DATA_PUBLISHERS = gql`
  query GetOpenDataPublishers {
    openDataPublishers {
      id
      name
      website
    }
  }
`
