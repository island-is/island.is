import { defineMessages } from 'react-intl'

export const draft = defineMessages({
  formTitle: {
    id: 'atr.application:draft.formTitle',
    defaultMessage: 'Endurgreiðsla áfengisgjalda',
    description: 'Title of the application',
  },
  sectionTitle: {
    id: 'atr.application:draft.sectionTitle',
    defaultMessage: 'Kolefnisjöfnun',
    description: 'Title for draftSection',
  },
  treeDescriptionFieldTitle: {
    id: 'atr.application:draft.treeDescriptionFieldTitle',
    defaultMessage: 'Kolefnisjöfnun',
    description: 'Title for draftSection',
  },
  treeDescriptionFieldDescription: {
    id: 'atr.application:draft.treeDescriptionFieldDescription#markdown',
    defaultMessage: 'Hefur þú áhuga á kolefnisjafna fyrir endugreiðsluna?',
    description: 'Title for draftSection',
  },
  submitButtonTitle: {
    id: 'atr.application:draft.submitButtonTitle',
    defaultMessage: 'Sækja um',
    description: 'Title for draftSection submit button',
  },
  treeSliderCo2EffectDescriptor: {
    id: 'atr.application:draft.treeSliderCo2EffectDescriptor#markdown',
    defaultMessage: 'Með {trees} tré ert þú að kolefnisjafna {co2} CO₂ tonn',
    description: 'Description message for the CO2 effect slider',
  },
})
