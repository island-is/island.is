import { defineMessages } from 'react-intl'

export const prereq = defineMessages({
  title: {
    id: 'vmst.cjs.prereq:title',
    defaultMessage: 'Vinnumálastofnun',
    description: 'Prerequisite service provider title',
  },
  subtitle: {
    id: 'vmst.cjs.prereq:subtitle',
    defaultMessage: 'Gögn sótt til Vinnumálastofnunar',
    description: 'Prerequisite service provider subtitle',
  },
  checkbox: {
    id: 'vmst.cjs.prereq:checkbox',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'Prerequisite checkbox text',
  },
  eligibilityErrorTitle: {
    id: 'vmst.cjs.prereq:eligibilityErrorTitle',
    defaultMessage: 'Villa kom upp',
    description:
      'Title shown when user is not eligible for job search confirmation',
  },
  noActiveApplicationFound: {
    id: 'vmst.cjs.prereq:noActiveApplicationFound',
    defaultMessage: 'Engin virk umsókn fannst',
    description: 'Summary shown when no active application is found (404)',
  },
})
