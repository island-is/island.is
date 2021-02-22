import { defineMessages } from 'react-intl'

// External information retrieval
export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External information retrieval subtitle',
    },
    checkboxLabel: {
      id:
        'crc.application:section.backgroundInformation.externalData.checkboxLabel',
      defaultMessage: 'Ég samþykki gagnaöflun',
      description: 'External information retrieval checkbox label',
    },
  }),
  applicant: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.applicant.title',
      defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
      description:
        'Title: External Info about applicant from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.applicant.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description:
        'Subtitle: External Info about applicant from the National Registry',
    },
  }),
  children: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.children.title',
      defaultMessage: 'Grunnupplýsingar um börn',
      description:
        'Title: External Info about applicants children from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.children.subTitle',
      defaultMessage:
        'Nöfn, kennitölur og núverandi lögheimili barna í þinni forsjá.',
      description:
        'Subtitle: External Info about applicants children from the National Registry',
    },
  }),
  otherParents: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.otherParents.title',
      defaultMessage: 'Grunnupplýsingar um foreldra',
      description:
        'Title: External Info about other parents from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.otherParents.subTitle',
      defaultMessage: 'Nöfn, kennitölur og lögheimili forelda barnanna.',
      description:
        'Subtitle: External Info about other parents from the National Registry',
    },
  }),
}
