export const GET_HNIPP_TEMPLATE_BY_ID = `
  query GetTemplateById($templateId: String!, $locale: String!) {
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

export const GET_HNIPP_TEMPLATES = `{
    hnippTemplateCollection($locale: String!) {
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
  }`

// Define other queries as needed...