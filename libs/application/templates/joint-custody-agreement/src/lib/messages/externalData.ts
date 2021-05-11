import { defineMessages } from 'react-intl'

// External information retrieval
export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id:
        'jca.application:section.backgroundInformation.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id:
        'jca.application:section.backgroundInformation.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'jca.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External information retrieval subtitle',
    },
    description: {
      id:
        'jca.application:section.backgroundInformation.externalData.description',
      defaultMessage:
        'Sýslumanni er nauðsynlegt að fá staðfestar upplýsingar um hvernig forsjá barna er háttað til að geta staðfest samning um breytt lögheimili barns. Eftirfarandi gagna verður því aflað með vísan til 2. tl. 9. gr. laga um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018.',
      description: 'External information retrieval description',
    },
    checkboxLabel: {
      id:
        'jca.application:section.backgroundInformation.externalData.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
      description: 'External information retrieval checkbox label',
    },
  }),
  applicant: defineMessages({
    title: {
      id:
        'jca.application:section.backgroundInformation.externalData.applicant.title',
      defaultMessage:
        'Grunnupplýsingar um börn í forsjá þinni og foreldra þeirra',
      description:
        'Title: External Info about applicants children from the National Registry',
    },
    subTitle: {
      id:
        'jca.application:section.backgroundInformation.externalData.applicant.subTitle',
      defaultMessage:
        'Nöfn, kennitölur, lögheimili og hjúskaparstaða foreldra.',
      description:
        'Subtitle: External Info about applicant from the National Registry',
    },
  }),
  children: defineMessages({
    title: {
      id:
        'jca.application:section.backgroundInformation.externalData.children.title',
      defaultMessage: 'Forsjárgögn frá Þjóðskrá Íslands',
      description:
        'Title: External Info about applicants children from the National Registry',
    },
    subTitle: {
      id:
        'jca.application:section.backgroundInformation.externalData.children.subTitle',
      defaultMessage: 'Staðfesting á núverandi fyrirkomulagi um forsjá barns.',
      description:
        'Subtitle: External Info about applicants children from the National Registry',
    },
  }),
}
