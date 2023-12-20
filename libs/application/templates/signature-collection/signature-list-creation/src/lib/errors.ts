import { defineMessages } from 'react-intl'

export const errorMessages = {
  age: defineMessages({
    title: {
      id: 'slc.application:error.age.title',
      defaultMessage: 'Aldur uppfyllir ekki skilyrði',
      description: '',
    },
    summary: {
      id: 'slc.application:error.age.title',
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
      id: 'slc.application:error.citizenship.title',
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
      id: 'slc.application:error.residency.title',
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
      id: 'slc.application:error.active.title',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
  owner: defineMessages({
    title: {
      id: 'slc.application:error.owner.title',
      defaultMessage: 'Þú átt núþegar lista í öllum söfnunarsvæðum',
      description: '',
    },
    summary: {
      id: 'slc.application:error.owner.title',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
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
      id: 'slc.application:error.deniedByService.title',
      defaultMessage: 'Ekki er hægt að stöfna söfnun meðmæla.',
      description: '',
    },
  }),
}
