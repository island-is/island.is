import { defineMessages } from 'react-intl'

export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.backgroundInformation.externalData.sectionTitle',
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
      id: 'fa.application:section.backgroundInformation.externalData.description',
      defaultMessage:
        'Við þurfum að afla gagna frá eftirfarandi opinberum aðilum til að einfalda umsóknarferlið, staðfesta réttleika upplýsinga og reikna út áætlaðar greiðslur.',
      description: 'External information retrieval description',
    },
    checkboxLabel: {
      id: 'fa.application:section.backgroundInformation.externalData.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
      description: 'External information retrieval checkbox label',
    },
  }),
  applicant: defineMessages({
    title: {
      id: 'fa.application:section.backgroundInformation.externalData.applicant.title',
      defaultMessage: 'Þjóðskrá Íslands',
      description:
        'Title: External Info about applicant from the National Registry',
    },
    subTitle: {
      id: 'fa.application:section.backgroundInformation.externalData.applicant.subTitle#markdown',
      defaultMessage: 'Við flettum upp lögheimili og hjúskaparstöðu.',
      description:
        'Subtitle: External Info about applicant from the National Registry',
    },
  }),
  taxData: defineMessages({
    title: {
      id: 'fa.application:section.backgroundInformation.externalData.taxData.title',
      defaultMessage: 'Skatturinn',
      description:
        'Title: External Info about applicant from the tax data gathering',
    },
    dataInfo: {
      id: 'fa.application:section.backgroundInformation.externalData.taxData.dataInfo',
      defaultMessage:
        'Afrit af skattframtali og upplýsingar um staðgreiðslu í staðgreiðsluskrá.',
      description: 'What data is retrived from the tax',
    },
    process: {
      id: 'fa.application:section.backgroundInformation.externalData.process.',
      defaultMessage:
        'Svo þurfum við að fá þig til að renna yfir nokkur atriði varðandi persónuhagi og fjármál til að reikna út fjárhagsaðstoð til útgreiðslu í byrjun næsta mánuðar. Í lok umsóknar getur þú sent hana inn eða eytt henni og öllum tengdum gögnum.',
      description:
        'Next steps in the application process and what will happen to the data that is gathered',
    },
  }),
}
