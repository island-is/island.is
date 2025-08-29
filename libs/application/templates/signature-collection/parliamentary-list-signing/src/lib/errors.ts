import { defineMessages } from 'react-intl'

export const errorMessages = {
  age: defineMessages({
    title: {
      id: 'pls.application:error.age.title',
      defaultMessage: 'Aldur uppfyllir ekki skilyrði',
      description: '',
    },
    summary: {
      id: 'pls.application:error.age.summary',
      defaultMessage: '18 ára aldursmarki er ekki náð',
      description: '',
    },
  }),
  citizenship: defineMessages({
    title: {
      id: 'pls.application:error.citizenship.title',
      defaultMessage: 'Ekki með íslenskt ríkisfang',
      description: '',
    },
    summary: {
      id: 'pls.application:error.citizenship.summary',
      defaultMessage: 'Þú þarft að vera með íslenskt ríkisfang',
      description: '',
    },
  }),
  areaId: defineMessages({
    title: {
      id: 'pls.application:error.areaId.title',
      defaultMessage: 'Ekki með kjördæmi skráð',
      description: '',
    },
    summary: {
      id: 'pls.application:error.areaId.summary',
      defaultMessage:
        'Hægt er að hafa samband við Þjóðskrá fyrir nánari upplýsingar.',
      description: '',
    },
  }),
  residency: defineMessages({
    title: {
      id: 'pls.application:error.residency.title',
      defaultMessage: 'Ekki með lögheimili á Íslandi',
      description: '',
    },
    summary: {
      id: 'pls.application:error.residency.summary',
      defaultMessage: 'Skilyrði um lögheimili á Íslandi eru ekki uppfyllt',
      description: '',
    },
  }),
  active: defineMessages({
    title: {
      id: 'pls.application:error.active.title',
      defaultMessage: 'Ekki er hægt að mæla með framboði',
      description: '',
    },
    summary: {
      id: 'pls.application:error.active.summary',
      defaultMessage: 'Framboð er ekki með virka meðmælasöfnun í þínu kjördæmi',
      description: '',
    },
  }),
  invalidSignature: defineMessages({
    title: {
      id: 'pls.application:error.invalidSignature.title',
      defaultMessage: 'Undirskrift til staðar í kerfi',
      description: '',
    },
    summary: {
      id: 'pls.application:error.invalidSignatureive.summary',
      defaultMessage: 'Nánari upplýsingar á mínum síðum.',
      description: '',
    },
  }),
  signer: defineMessages({
    title: {
      id: 'pls.application:error.signer.title',
      defaultMessage: 'Þú hefur nú þegar skrifað undir lista í þessari söfnun',
      description: '',
    },
    summary: {
      id: 'pls.application:error.signer.summary#markdown',
      defaultMessage: 'Hægt er að draga meðmæli til baka inni á Mínum Síðum.',
      description: '',
    },
  }),
  deniedByService: defineMessages({
    title: {
      id: 'pls.application:error.deniedByService.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'pls.application:error.deniedByService.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  maxReached: defineMessages({
    title: {
      id: 'pls.application:error.maxReached.title',
      defaultMessage: 'Framboð hefur náð hámarksfjölda meðmæla',
      description: '',
    },
    summary: {
      id: 'pls.application:error.maxReached.summary',
      defaultMessage: 'Ekki er lengur hægt að mæla með þessu framboði.',
      description: '',
    },
  }),
  submitFailure: defineMessages({
    title: {
      id: 'pls.application:error.submitFailure.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'pls.application:error.submitFailure.summary',
      defaultMessage: 'Tókst ekki að skrá meðmæli.',
      description: '',
    },
  }),
  singeeNotFound: defineMessages({
    title: {
      id: 'pls.application:error.singeeNotFound.title',
      defaultMessage:
        'Notandi uppfyllir ekki skilyrði til að framkvæma þessa aðgerð',
      description: '',
    },
    summary: {
      id: 'pls.application:error.singeeNotFound.summary',
      defaultMessage:
        'Hægt er að hafa samband við Þjóðskrá fyrir nánari upplýsingar.',
      description: '',
    },
  }),
}
