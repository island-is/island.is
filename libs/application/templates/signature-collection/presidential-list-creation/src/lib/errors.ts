import { defineMessages } from 'react-intl'

export const errorMessages = {
  age: defineMessages({
    title: {
      id: 'slc.application:error.age.title',
      defaultMessage: 'Aldur uppfyllir ekki skilyrði',
      description: '',
    },
    summary: {
      id: 'slc.application:error.age.summary#markdown',
      defaultMessage: '35 ára aldursmark er ekki náð',
      description: '',
    },
  }),
  citizenship: defineMessages({
    title: {
      id: 'slc.application:error.citizenship.title',
      defaultMessage: 'Ekki með íslenskt ríkisfang',
      description: '',
    },
    summary: {
      id: 'slc.application:error.citizenship.summary#markdown',
      defaultMessage: 'Þú þarft að vera með íslenskt ríkisfang',
      description: '',
    },
  }),
  residency: defineMessages({
    title: {
      id: 'slc.application:error.residency.title',
      defaultMessage: 'Ekki með lögheimili á Íslandi',
      description: '',
    },
    summary: {
      id: 'slc.application:error.residency.summary#markdown',
      defaultMessage: 'Skilyrði um lögheimili á Íslandi eru ekki uppfyllt',
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
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
  owner: defineMessages({
    title: {
      id: 'slc.application:error.owner.title',
      defaultMessage: 'Þú átt nú þegar lista í öllum söfnunarsvæðum',
      description: '',
    },
    summary: {
      id: 'slc.application:error.owner.summary#markdown',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
  deniedByService: defineMessages({
    title: {
      id: 'slc.application:error.deniedByService.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'slc.application:error.deniedByService.summary',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
}
