import { defineMessages } from 'react-intl'

export const errorMessages = {
  age: defineMessages({
    title: {
      id: 'plc.application:error.age.title',
      defaultMessage: 'Aldur uppfyllir ekki skilyrði',
      description: '',
    },
    summary: {
      id: 'plc.application:error.age.summary#markdown',
      defaultMessage: '35 ára aldursmarki er ekki náð',
      description: '',
    },
  }),
  partyBallotLetter: defineMessages({
    title: {
      id: 'plc.application:error.partyBallotLetter.title',
      defaultMessage: 'Ekki er hægt að stofna meðmælasöfnun',
      description: '',
    },
    summary: {
      id: 'plc.application:error.partyBallotLetter.summary',
      defaultMessage:
        'Innskráður notandi/fyrirtæki vantar framboð eða listabókstaf',
      description: '',
    },
  }),
  alreadyCandidate: defineMessages({
    title: {
      id: 'plc.application:error.alreadyCandidate.title',
      defaultMessage: 'Ekki hægt að tvískrá meðmælasöfnun',
      description: '',
    },
    summary: {
      id: 'plc.application:error.alreadyCandidate.summary',
      defaultMessage:
        'Þú ert nú þegar með framboð. Þú getur nálgast nánari upplýsingar um þína meðmælasöfnun á Mínum Síðum.',
      description: '',
    },
  }),
  citizenship: defineMessages({
    title: {
      id: 'plc.application:error.citizenship.title',
      defaultMessage: 'Ekki með íslenskt ríkisfang',
      description: '',
    },
    summary: {
      id: 'plc.application:error.citizenship.summary#markdown',
      defaultMessage: 'Þú þarft að vera með íslenskt ríkisfang',
      description: '',
    },
  }),
  residency: defineMessages({
    title: {
      id: 'plc.application:error.residency.title',
      defaultMessage: 'Ekki með lögheimili á Íslandi',
      description: '',
    },
    summary: {
      id: 'plc.application:error.residency.summary#markdown',
      defaultMessage: 'Skilyrði um lögheimili á Íslandi eru ekki uppfyllt',
      description: '',
    },
  }),
  active: defineMessages({
    title: {
      id: 'plc.application:error.active.title',
      defaultMessage: 'Engin söfnun meðmæla er virk',
      description: '',
    },
    summary: {
      id: 'plc.application:error.active.summary',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
  owner: defineMessages({
    title: {
      id: 'plc.application:error.owner.title',
      defaultMessage: 'Þú átt nú þegar lista í öllum söfnunarsvæðum',
      description: '',
    },
    summary: {
      id: 'plc.application:error.owner.summary#markdown',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
  deniedByService: defineMessages({
    title: {
      id: 'plc.application:error.deniedByService.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'plc.application:error.deniedByService.summary',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
  currentCollectionNotParliamentary: defineMessages({
    title: {
      id: 'plc.application:error.currentCollectionNotParliamentary.title',
      defaultMessage: 'Söfnun fyrir Alþingiskosningar er ekki virk',
      description: '',
    },
    summary: {
      id: 'plc.application:error.currentCollectionNotParliamentary.summary',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla',
      description: '',
    },
  }),
}
