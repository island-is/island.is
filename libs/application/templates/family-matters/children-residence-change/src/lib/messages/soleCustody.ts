import { defineMessages } from 'react-intl'

// Sole custody modal text
export const soleCustody = defineMessages({
  title: {
    id: 'crc.application:section.backgroundInformation.soleCustody.title',
    defaultMessage: 'Þú átt engin börn í sameiginlegri forsjá',
    description:
      'Title displayed in modal when the applicant has sole custody of all children',
  },
  description: {
    id: 'crc.application:section.backgroundInformation.soleCustody.description#markdown',
    defaultMessage:
      'Uppfletting í gögnum hjá Þjóðskrá Íslands skilaði eingöngu börnum sem eru alfarið í þinni forsjá.\n\nÞessi umsókn er ætluð foreldrum sem fara sameiginlega með forsjá barna sinna.',
    description:
      'Description displayed in modal when the applicant has sole custody of all children',
  },
  linkHref: {
    id: 'crc.application:section.backgroundInformation.soleCustody.linkHref',
    defaultMessage: 'https://www.island.is/',
    description:
      'Link href displayed in modal when the applicant has sole custody of all children',
  },
  linkText: {
    id: 'crc.application:section.backgroundInformation.soleCustody.linkText',
    defaultMessage: 'Aftur á vef sýslumanna',
    description:
      'Link text displayed in modal when the applicant has sole custody of all children',
  },
})
