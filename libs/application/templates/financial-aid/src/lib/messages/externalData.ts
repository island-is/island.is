import { defineMessages } from 'react-intl'

export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id:
        'fa.application:section.backgroundInformation.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id: 'fa.application:section.backgroundInformation.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'fa.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External information retrieval subtitle',
    },
    description: {
      id:
        'fa.application:section.backgroundInformation.externalData.description',
      defaultMessage:
        'Við þurfum að afla gagna frá eftirfarandi opinberum aðilum til að einfalda umsóknarferlið, staðfesta réttleika upplýsinga og reikna út áætlaðar greiðslur.',
      description: 'External information retrieval description',
    },
    checkboxLabel: {
      id:
        'fa.application:section.backgroundInformation.externalData.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
      description: 'External information retrieval checkbox label',
    },
  }),
  applicant: defineMessages({
    title: {
      id:
        'fa.application:section.backgroundInformation.externalData.applicant.title',
      defaultMessage: 'Þjóðskrá Íslands',
      description:
        'Title: External Info about applicant from the National Registry',
    },
    subTitle: {
      id:
        'fa.application:section.backgroundInformation.externalData.applicant.subTitle#markdown',
      defaultMessage: 'Við flettum upp lögheimili og hjúskaparstöðu.',
      description:
        'Subtitle: External Info about applicant from the National Registry',
    },
  }),
}
