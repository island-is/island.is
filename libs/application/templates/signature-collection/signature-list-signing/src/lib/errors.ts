import { defineMessages } from 'react-intl'

export const errorMessages = {
  age: defineMessages({
    title: {
      id: 'slc.application:error.age.title',
      defaultMessage: 'Aldur uppfyllir ekki skilyrði',
      description: '',
    },
    summary: {
      id: 'slc.application:error.age.summary',
      defaultMessage: '35 ára aldursmark er ekki náð',
      description: '',
    },
  }),
  citizenship: defineMessages({
    title: {
      id: 'slc.application:error.citizenship.title',
      defaultMessage: 'Ekki með íslenkst ríkisfang',
      description: '',
    },
    summary: {
      id: 'slc.application:error.citizenship.summary',
      defaultMessage: 'Þú þarft að vera með íslenkst ríkisfang',
      description: '',
    },
  }),
  residency: defineMessages({
    title: {
      id: 'slc.application:error.residency.title',
      defaultMessage: 'Ekki með búsetu á Íslandi',
      description: '',
    },
    summary: {
      id: 'slc.application:error.residency.summary',
      defaultMessage: 'Skilyrði um búsetu á Íslandi eru ekki uppfyllt',
      description: '',
    },
  }),
  active: defineMessages({
    title: {
      id: 'slc.application:error.active.title',
      defaultMessage: 'Engin söfnun meðmæla er virk',
      description: '',
    },
    summary: {
      id: 'slc.application:error.active.summary',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
  signer: defineMessages({
    title: {
      id: 'slc.application:error.signer.title',
      defaultMessage: 'Þú hefur núþegar skrifað undir lista í þessari söfnun',
      description: '',
    },
    summary: {
      id: 'slc.application:error.signer.summary',
      defaultMessage: 'Hægt er að draga meðmæli tilbaka á mínum síðum',
      description: '',
    },
  }),
  deniedByService: defineMessages({
    title: {
      id: 'slc.application:error.deniedByService.title',
      defaultMessage: 'Etthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'slc.application:error.deniedByService.summary',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
  submitFailure: defineMessages({
    title: {
      id: 'slc.application:error.submitFailure.title',
      defaultMessage: 'Ekitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'slc.application:error.submitFailure.summary',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
}
