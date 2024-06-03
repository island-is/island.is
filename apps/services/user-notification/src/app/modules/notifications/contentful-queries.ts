export const GET_HNIPP_TEMPLATE_BY_TEMPLATE_ID = `
  query GetTemplateByTemplateId($templateId: String!, $locale: String!) {
    hnippTemplateCollection(where: {templateId: $templateId}, locale: $locale) {
      items {
        templateId
        notificationTitle
        notificationBody
        notificationDataCopy
        clickAction
        clickActionWeb
        clickActionUrl
        category
        args
      }
    }
  }
`;

export const GET_HNIPP_TEMPLATES = `
  query GetTemplates($locale: String!){
    hnippTemplateCollection(locale: $locale,limit: 1000) {
      items {
        templateId
        notificationTitle
        notificationBody
        notificationDataCopy
        clickAction
        clickActionWeb
        clickActionUrl
        category
        args
      }
    }
  }
`

export const GET_ORGANIZATION_BY_KENNITALA = `
query GetOrganizationByKennitala($kennitala: String!, $locale: String!){
    organizationCollection(where: {kennitala: $kennitala}, locale: $locale) {
      items {
        title
      }
    }
  }`