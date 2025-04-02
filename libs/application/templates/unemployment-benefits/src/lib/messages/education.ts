import { defineMessages } from 'react-intl'

export const education = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:education.general.sectionTitle',
      defaultMessage: 'Menntun',
      description: 'Education section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:education.general.pageTitle',
      defaultMessage: 'Menntun',
      description: 'education section page title',
    },
    pageDescription: {
      id: 'vmst.ub.application:education.general.pageDescription',
      defaultMessage:
        'Einstaklingar í námi eiga yfirleitt ekki rétt á atvinnuleysisbótum. Það eru þó undantekningar á þessu, til dæmis ef nám er 20 einingar eða minna, einstaklingur missir vinnu eftir að önn hefst eða námið er skilgreint sem nám með vinnu.',
      description: 'education section page description',
    },
  }),
  labels: defineMessages({}),
}
