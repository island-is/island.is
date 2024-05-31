export const GET_TEMPLATE_BY_ID = `
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

// Define other queries as needed...