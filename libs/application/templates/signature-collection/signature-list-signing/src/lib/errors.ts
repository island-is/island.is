import { defineMessages } from 'react-intl'

export const errorMessages = {
  age: defineMessages({
    title: {
      id: 'sls.application:error.age.title',
      defaultMessage: 'Aldur uppfyllir ekki skilyrði',
      description: '',
    },
    summary: {
      id: 'sls.application:error.age.summary',
      defaultMessage: '35 ára aldursmark er ekki náð',
      description: '',
    },
  }),
  citizenship: defineMessages({
    title: {
      id: 'sls.application:error.citizenship.title',
      defaultMessage: 'Ekki með íslenkst ríkisfang',
      description: '',
    },
    summary: {
      id: 'sls.application:error.citizenship.summary',
      defaultMessage: 'Þú þarft að vera með íslenkst ríkisfang',
      description: '',
    },
  }),
  residency: defineMessages({
    title: {
      id: 'sls.application:error.residency.title',
      defaultMessage: 'Ekki með búsetu á Íslandi',
      description: '',
    },
    summary: {
      id: 'sls.application:error.residency.summary',
      defaultMessage: 'Skilyrði um búsetu á Íslandi eru ekki uppfyllt',
      description: '',
    },
  }),
  active: defineMessages({
    title: {
      id: 'sls.application:error.active.title',
      defaultMessage: 'Engin söfnun meðmæla er virk',
      description: '',
    },
    summary: {
      id: 'sls.application:error.active.summary',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
  signer: defineMessages({
    title: {
      id: 'sls.application:error.signer.title',
      defaultMessage: 'Þú hefur nú þegar skrifað undir lista í þessari söfnun',
      description: '',
    },
    summary: {
      id: 'sls.application:error.signer.summary#markdown',
      defaultMessage: 'Hægt er að draga meðmæli tilbaka inni á Mínum Síðum.',
      description: '',
    },
  }),
  owner: defineMessages({
    title: {
      id: 'sls.application:error.owner.title',
      defaultMessage: 'Þú átt nú þegar lista í öllum söfnunarsvæðum',
      description: '',
    },
    summary: {
      id: 'sls.application:error.owner.summary',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
  deniedByService: defineMessages({
    title: {
      id: 'sls.application:error.deniedByService.title',
      defaultMessage: 'Etthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'sls.application:error.deniedByService.summary',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
  submitFailure: defineMessages({
    title: {
      id: 'sls.application:error.submitFailure.title',
      defaultMessage: 'Ekitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'sls.application:error.submitFailure.summary',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
}
