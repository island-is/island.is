import { defineMessages } from 'react-intl'

export const incomeFilesForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.incomeFilesForm.general.sectionTitle',
      defaultMessage: 'Tekjugögn',
      description: 'Income files form section Title',
    },
    pageTitle: {
      id: 'fa.application:section.incomeFilesForm.general.pageTitle',
      defaultMessage: 'Tekjugögn',
      description: 'Income files form page title',
    },
    description: {
      id: 'fa.application:section.incomeFilesForm.general.description',
      defaultMessage:
        'Við þurfum að sjá gögn um tekjur í þessum og síðustu tvo mánuði. Þú getur smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá.',
      description: 'Income files form description',
    },
    descriptionTaxSuccess: {
      id: 'fa.application:section.incomeFilesForm.general.descriptionTaxSuccess',
      defaultMessage:
        'Við þurfum að sjá gögn um tekjur í síðasta mánuði. Þú getur smellt mynd af launaseðlum eða öðrum tekjugögnum, nálgast gögn í heimabankanum eða hjá þeirri stofnun sem þú fékkst tekjur frá.',
      description:
        'Income files form description when fetching the direct tax payments was success',
    },
  }),
}
