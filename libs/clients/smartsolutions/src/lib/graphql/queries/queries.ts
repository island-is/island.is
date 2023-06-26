export const LIST_TEMPLATES = `
  query passTemplateQuery {
    passTemplates {
      data {
        id
        name
      }
    }
  }
`

export const LIST_PASS_STATUSES = `
  query ListPassStatuses($queryId: String!, $passTemplateId: String!) {
    passes(
      search: { query: $queryId },
      passTemplateId: $passTemplateId,
      order: { column: WHEN_MODIFIED, dir: DESC },
      hideByStatus: {deleted: true },
      ) {
      data {
        id
        distributionUrl
        distributionQRCode
        status
      }
    }
  }
`

export const LIST_PASSES = `
  query ListPasses($queryId: String!, $passTemplateId: String!) {
    passes(search: { query: $queryId },
      passTemplateId: $passTemplateId,
      hideByStatus: {deleted: true },
      order: { column: WHEN_MODIFIED, dir: DESC }
      ) {
      data {
        whenCreated
        whenModified
        passTemplate {
            id
        }
        distributionUrl
        distributionQRCode
        id
        status
        inputFieldValues {
          passInputField {
            identifier
          }
          value
        }
      }
    }
  }
`

export const GET_PASS = `
  query GetPass($id: String!) {
    pass(id: $id) {
      expirationDate
      externalIdentifier
      id
      inputFieldValues {
        id
        value
        passInputField {
          id
          identifier
        }
      }
      thumbnail {
        filename
        height
        id
        title
        originalUrl
        url
        width
      }
    }
  }
`
