import { defineMessages } from 'react-intl'

export const errorMessages = {
  age: defineMessages({
    title: {
      id: 'mls.application:error.age.title',
      defaultMessage: 'Aldur uppfyllir ekki skilyrði',
      description: '',
    },
    summary: {
      id: 'mls.application:error.age.summary',
      defaultMessage: '18 ára aldursmarki er ekki náð',
      description: '',
    },
  }),
  citizenship: defineMessages({
    title: {
      id: 'mls.application:error.citizenship.title',
      defaultMessage: 'Ekki með íslenskt ríkisfang',
      description: '',
    },
    summary: {
      id: 'mls.application:error.citizenship.summary',
      defaultMessage: 'Þú þarft að vera með íslenskt ríkisfang',
      description: '',
    },
  }),
  areaId: defineMessages({
    title: {
      id: 'mls.application:error.areaId.title',
      defaultMessage: 'Ekki með landsfjórðung skráðan',
      description: '',
    },
    summary: {
      id: 'mls.application:error.areaId.summary',
      defaultMessage:
        'Hægt er að hafa samband við Þjóðskrá fyrir nánari upplýsingar.',
      description: '',
    },
  }),
  residency: defineMessages({
    title: {
      id: 'mls.application:error.residency.title',
      defaultMessage: 'Ekki með lögheimili á Íslandi',
      description: '',
    },
    summary: {
      id: 'mls.application:error.residency.summary',
      defaultMessage: 'Skilyrði um lögheimili á Íslandi eru ekki uppfyllt',
      description: '',
    },
  }),
  active: defineMessages({
    title: {
      id: 'mls.application:error.active.title',
      defaultMessage: 'Engin söfnun meðmæla er virk',
      description: '',
    },
    summary: {
      id: 'mls.application:error.active.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  candidateListActive: defineMessages({
    title: {
      id: 'mls.application:error.candidateListActive.title',
      defaultMessage: 'Framboð er ekki með virka söfnun í þínu sveitarfélagi',
      description: '',
    },
    summary: {
      id: 'mls.application:error.active.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  invalidSignature: defineMessages({
    title: {
      id: 'mls.application:error.invalidSignature.title',
      defaultMessage: 'Undirskrift til staðar í kerfi',
      description: '',
    },
    summary: {
      id: 'mls.application:error.acinvalidSignatureive.summary',
      defaultMessage: 'Nánari upplýsingar á mínum síðum.',
      description: '',
    },
  }),
  singeeNotFound: defineMessages({
    title: {
      id: 'mls.application:error.singeeNotFound.title',
      defaultMessage:
        'Notandi uppfyllir ekki skilyrði til að framkvæma þessa aðgerð',
      description: '',
    },
    summary: {
      id: 'mls.application:error.singeeNotFound.summary',
      defaultMessage:
        'Hægt er að hafa samband við Þjóðskrá fyrir nánari upplýsingar.',
      description: '',
    },
  }),
  candidateNotFound: defineMessages({
    title: {
      id: 'mls.application:error.candidateNotFound.title',
      defaultMessage: 'Framboð finnst ekki',
      description: '',
    },
    summary: {
      id: 'mls.application:error.candidateNotFound.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  signer: defineMessages({
    title: {
      id: 'mls.application:error.signer.title',
      defaultMessage: 'Þú hefur nú þegar skrifað undir lista í þessari söfnun',
      description: '',
    },
    summary: {
      id: 'mls.application:error.signer.summary#markdown',
      defaultMessage: 'Hægt er að draga meðmæli til baka inni á Mínum Síðum.',
      description: '',
    },
  }),
  deniedByService: defineMessages({
    title: {
      id: 'mls.application:error.deniedByService.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'mls.application:error.deniedByService.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  maxReached: defineMessages({
    title: {
      id: 'mls.application:error.maxReached.title',
      defaultMessage: 'Framboð hefur náð hámarksfjölda meðmæla.',
      description: '',
    },
    summary: {
      id: 'mls.application:error.maxReached.summary',
      defaultMessage: 'Ekki er lengur hægt að mæla með þessu framboði.',
      description: '',
    },
  }),
  submitFailure: defineMessages({
    title: {
      id: 'mls.application:error.submitFailure.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'mls.application:error.submitFailure.summary',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
}
