import { defineMessages } from 'react-intl'

export const m = defineMessages({
  restrictions: {
    id: 'portals:restrictions',
    defaultMessage: 'Takmarkanir',
  },
  restrictionsIntro: {
    id: 'portals:restrictions-intro',
    defaultMessage:
      '[Texti sem útskýrir hvað þetta er og af hverju þetta er möguleiki, kannski eitthvað fleira]',
  },
  restrictionsDevicesTitle: {
    id: 'portals:restrictions-devices-title',
    defaultMessage: 'Takmarka innskráningar við þekkt tæki ',
  },
  restrictionsDevicesDescription: {
    id: 'portals:restrictions-devices-description',
    defaultMessage:
      '[Texti sem útskýrir hvað þetta er og af hverju þetta er möguleiki, kannski eitthvað fleira]',
  },
  enableRestrictions: {
    id: 'portals:enable-restrictions',
    defaultMessage: 'Virkja takmarkanir',
  },
  disableRestrictions: {
    id: 'portals:disable-restrictions',
    defaultMessage: 'Afvirkja takmarkanir',
  },
  closeModal: {
    id: 'portals:close-modal',
    defaultMessage: 'Loka glugga',
  },
  modalTitle: {
    id: 'portals:modal-title',
    defaultMessage: 'Takmarka innskráningar við þekkt tæki',
  },
  modalDescription: {
    id: 'portals:modal-description',
    defaultMessage:
      '[Texti sem segir að þú sért að takmarka innskráningar við þekkt tæki til {date}]',
  },
  modalConfirmText: {
    id: 'portals:modal-confirm-text',
    defaultMessage: '[Staðfestu til að virkja takmörkun eða hættu við]',
  },
  cancel: {
    id: 'portals:modal-cancel',
    defaultMessage: 'Hætta við',
  },
  confirm: {
    id: 'portals:modal-confirm',
    defaultMessage: 'Staðfesta',
  },
  messageEnabledRestriction: {
    id: 'portals:enabled-restriction',
    defaultMessage: 'Þú ert með virka takmörkun til {date}',
  },
  warningElectronicId: {
    id: 'portals:warning-electronic-id',
    defaultMessage:
      'Aðeins er hægt að virkja takmarkanir við innskráningu með því að vera skráður inn með rafrænum skilríkjum í síma.',
  },
  invalidIntent: {
    id: 'portals:invalid-intent',
    defaultMessage: 'Ógild aðgerð',
  },
  invalidDate: {
    id: 'portals:invalid-date',
    defaultMessage: 'Dagsetning er ekki rétt',
  },
})
