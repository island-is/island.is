import { defineMessages } from 'react-intl'

export const typeSelection = {
  general: defineMessages({
    section: {
      id: 'ojoi.application:typeSelection.general.section',
      defaultMessage: 'Tegund innsendingar',
    },
    title: {
      id: 'ojoi.application:typeSelection.general.title',
      defaultMessage: 'Veldu tegund innsendingar',
    },
    description: {
      id: 'ojoi.application:typeSelection.general.description',
      defaultMessage:
        'Veldu hvaða tegund innsendingar þú vilt senda til birtingar í Stjórnartíðindum.',
    },
  }),
  options: defineMessages({
    ad: {
      id: 'ojoi.application:typeSelection.options.ad',
      defaultMessage: 'Auglýsing',
    },
    adDescription: {
      id: 'ojoi.application:typeSelection.options.adDescription',
      defaultMessage: 'Almenn auglýsing til birtingar í Stjórnartíðindum.',
    },
    baseRegulation: {
      id: 'ojoi.application:typeSelection.options.baseRegulation',
      defaultMessage: 'Stofnreglugerð',
    },
    baseRegulationDescription: {
      id: 'ojoi.application:typeSelection.options.baseRegulationDescription',
      defaultMessage: 'Ný reglugerð sem ekki breytir annarri reglugerð.',
    },
    amendingRegulation: {
      id: 'ojoi.application:typeSelection.options.amendingRegulation',
      defaultMessage: 'Breytingareglugerð',
    },
    amendingRegulationDescription: {
      id: 'ojoi.application:typeSelection.options.amendingRegulationDescription',
      defaultMessage:
        'Reglugerð sem breytir eða fellir úr gildi aðra reglugerð.',
    },
  }),
  reader: defineMessages({
    label: {
      id: 'ojoi.application:typeSelection.reader.label',
      defaultMessage: 'Auka sendandi',
    },
    placeholder: {
      id: 'ojoi.application:typeSelection.reader.placeholder',
      defaultMessage: 'Veldu auka sendanda',
    },
    tooltip: {
      id: 'ojoi.application:typeSelection.reader.tooltip',
      defaultMessage:
        'Valinn auka sendandi getur skoðað innihald þessarar umsóknar áður en hún er send til ritstjórnar, en ekki breytt innihaldi umsóknarinnar',
    },
  }),
}
