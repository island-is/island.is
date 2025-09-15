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
      defaultMessage: '18 ára aldursmarki er ekki náð',
      description: '',
    },
  }),
  citizenship: defineMessages({
    title: {
      id: 'sls.application:error.citizenship.title',
      defaultMessage: 'Ekki með íslenskt ríkisfang',
      description: '',
    },
    summary: {
      id: 'sls.application:error.citizenship.summary#markdown',
      defaultMessage: 'Þú þarft að vera með íslenskt ríkisfang',
      description: '',
    },
  }),
  areaId: defineMessages({
    title: {
      id: 'sls.application:error.areaId.title',
      defaultMessage: 'Ekki með landsfjórðung skráðan',
      description: '',
    },
    summary: {
      id: 'sls.application:error.areaId.summary',
      defaultMessage:
        'Hægt er að hafa samband við Þjóðskrá fyrir nánari upplýsingar.',
      description: '',
    },
  }),
  residency: defineMessages({
    title: {
      id: 'sls.application:error.residency.title',
      defaultMessage: 'Ekki með lögheimili á Íslandi',
      description: '',
    },
    summary: {
      id: 'sls.application:error.residency.summary',
      defaultMessage: 'Skilyrði um lögheimili á Íslandi eru ekki uppfyllt',
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
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  invalidSignature: defineMessages({
    title: {
      id: 'sls.application:error.invalidSignature.title',
      defaultMessage: 'Undirskrift til staðar í kerfi',
      description: '',
    },
    summary: {
      id: 'sls.application:error.acinvalidSignatureive.summary',
      defaultMessage: 'Nánari upplýsingar á mínum síðum.',
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
      defaultMessage: 'Hægt er að draga meðmæli til baka inni á Mínum Síðum.',
      description: '',
    },
  }),
  deniedByService: defineMessages({
    title: {
      id: 'sls.application:error.deniedByService.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'sls.application:error.deniedByService.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  maxReached: defineMessages({
    title: {
      id: 'sls.application:error.maxReached.title',
      defaultMessage: 'Framboð hefur náð hámarksfjölda meðmæla.',
      description: '',
    },
    summary: {
      id: 'sls.application:error.maxReached.summary',
      defaultMessage: 'Ekki er lengur hægt að mæla með þessu framboði.',
      description: '',
    },
  }),
  submitFailure: defineMessages({
    title: {
      id: 'sls.application:error.submitFailure.title',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: '',
    },
    summary: {
      id: 'sls.application:error.submitFailure.summary',
      defaultMessage: 'Ekki er hægt að stofna söfnun meðmæla.',
      description: '',
    },
  }),
  candidateNotFound: defineMessages({
    title: {
      id: 'sls.application:error.candidateNotFound.title',
      defaultMessage: 'Framboð finnst ekki',
      description: '',
    },
    summary: {
      id: 'sls.application:error.candidateNotFound.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
  candidateListActive: defineMessages({
    title: {
      id: 'sls.application:error.candidateListActive.title',
      defaultMessage: 'Framboð er ekki með virka söfnun í þínum landsfjórðungi',
      description: '',
    },
    summary: {
      id: 'sls.application:error.active.summary',
      defaultMessage: 'Ekki er hægt að mæla með framboði.',
      description: '',
    },
  }),
}
