import { defineMessages } from 'react-intl'

// External information retrieval
export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External information retrieval subtitle',
    },
    description: {
      id: 'crc.application:section.backgroundInformation.externalData.description',
      defaultMessage:
        'Sýslumanni er nauðsynlegt að fá staðfestar upplýsingar um hvernig forsjá barna er háttað til að geta staðfest samning um breytt lögheimili barns. Eftirfarandi gagna verður því aflað með vísan til 2. tl. 9. gr. laga um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018.',
      description: 'External information retrieval description',
    },
    checkboxLabel: {
      id: 'crc.application:section.backgroundInformation.externalData.checkboxLabel',
      defaultMessage: 'Ég samþykki gagnaöflun',
      description: 'External information retrieval checkbox label',
    },
  }),
  applicant: defineMessages({
    title: {
      id: 'crc.application:section.backgroundInformation.externalData.applicant.title',
      defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
      description:
        'Title: External Info about applicant from the National Registry',
    },
    subTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.applicant.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description:
        'Subtitle: External Info about applicant from the National Registry',
    },
  }),
  children: defineMessages({
    title: {
      id: 'crc.application:section.backgroundInformation.externalData.children.title',
      defaultMessage: 'Grunnupplýsingar um börn',
      description:
        'Title: External Info about applicants children from the National Registry',
    },
    subTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.children.subTitle',
      defaultMessage:
        'Nöfn, kennitölur og núverandi lögheimili barna í þinni forsjá.',
      description:
        'Subtitle: External Info about applicants children from the National Registry',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'crc.application:section.backgroundInformation.externalData.userProfile.title',
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User Profile Title',
    },
    subTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.userProfile.subTitle',
      defaultMessage:
        'Símanúmer, netfang. Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
      description: 'User Profile Subtitle',
    },
  }),
}
