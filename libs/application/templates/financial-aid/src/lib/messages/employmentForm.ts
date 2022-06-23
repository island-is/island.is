import { defineMessages } from 'react-intl'

export const employmentForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.employmentForm.general.sectionTitle',
      defaultMessage: 'Atvinna',
      description: 'Employment form section title',
    },
    pageTitle: {
      id: 'fa.application:section.employmentForm.general.pageTitle',
      defaultMessage: 'Hvað lýsir stöðu þinni best?',
      description: 'Employment form page title',
    },
  }),
  employment: defineMessages({
    working: {
      id: 'fa.application:section.employmentForm.employment.working',
      defaultMessage: 'Ég er með atvinnu',
      description:
        'Employment form radio selection when applicant is currently working',
    },
    unemployed: {
      id: 'fa.application:section.employmentForm.employment.unemployed',
      defaultMessage: 'Ég er atvinnulaus',
      description:
        'Employment form radio selection when applicant is currently unemployed',
    },
    cannotWork: {
      id: 'fa.application:section.employmentForm.employment.cannotWork',
      defaultMessage: 'Ég er ekki vinnufær',
      description: 'Employment form radio selection when applicant cannot work',
    },
    other: {
      id: 'fa.application:section.employmentForm.employment.other',
      defaultMessage: 'Ekkert að ofan lýsir minni stöðu',
      description: 'Employment form radio selection when nothing applies',
    },
  }),
}
