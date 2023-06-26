import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  termsAgreementRequired: {
    id: `ls.application:errors.termsAgreementRequired`,
    defaultMessage: 'Skylda er að samþykkja skilmálana til að halda áfram',
    description: 'Terms agreement required error message',
  },
  required: {
    id: `ls.application:errors.requiredDefaultMessage`,
    defaultMessage: 'Skylda er að fylla út þennan reit',
    description: 'Required default error message',
  },
  nationalId: {
    id: `ls.application:errors.nationalId`,
    defaultMessage: 'Kennitala þarf að vera gild',
    description: 'National ID error message',
  },
  invalidIsatNumber: {
    id: `ls.application:errors.invalidIsatNumber`,
    defaultMessage: 'ÍSAT númer verður að byrja á 84',
    description: 'Invalid ÍSAT number error message',
  },
  invalidIsatMessage: {
    id: `ls.application:errors.invalidIsatNumber`,
    defaultMessage:
      'Innskráningarþjónusta Ísland.is er einungis í boði fyrir opinberar stofnanir',
    description: 'Invalid ÍSAT generic text',
  },
  invalidIsatPdfUrl: {
    id: `ls.application:errors.invalidIsatPdfUrl`,
    defaultMessage: 'https://www.hagstofa.is/media/49171/isat2008.pdf',
    description: 'ÍSAT pdf url',
  },
})
