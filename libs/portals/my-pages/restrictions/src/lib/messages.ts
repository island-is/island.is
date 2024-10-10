import { defineMessages } from 'react-intl'

export const m = defineMessages({
  restrictions: {
    id: 'sp.restrictions:title',
    defaultMessage: 'Takmarkanir',
  },
  restrictionsIntro: {
    id: 'sp.restrictions:intro',
    defaultMessage:
      'Hérna getur þú virkjað og afvirkjað takmarkanir á innskráningum með rafrænum skilríkjum á síma í innskráningar- og umboðskerfi Ísland.is.',
  },
  restrictionsDevicesTitle: {
    id: 'sp.restrictions:devices-title',
    defaultMessage: 'Takmarka innskráningar við þekkt tæki ',
  },
  restrictionsDevicesDescription: {
    id: 'sp.restrictions:devices-description',
    defaultMessage:
      'Hérna getur þú takmarkað tilraunir til innskráningar við tæki sem þú hefur áður notað til þess að skrá þig inn. Þetta á við um auðkenningu með rafrænum skilríkjum í síma.',
  },
  enableRestrictions: {
    id: 'sp.restrictions:enable-restrictions',
    defaultMessage: 'Virkja takmarkanir',
  },
  disableRestrictions: {
    id: 'sp.restrictions:disable-restrictions',
    defaultMessage: 'Afvirkja takmarkanir',
  },
  closeModal: {
    id: 'sp.restrictions:close-modal',
    defaultMessage: 'Loka glugga',
  },
  modalTitle: {
    id: 'sp.restrictions:modal-title',
    defaultMessage: 'Takmarka innskráningar við þekkt tæki',
  },
  modalDescription: {
    id: 'sp.restrictions:modal-description',
    defaultMessage:
      'Með því að staðfesta verða innskráningar á þitt símanúmer takmarkaðar við tæki sem þú hefur áður notað til þess að skrá þig inn.',
  },
  modalConfirmText: {
    id: 'sp.restrictions:modal-date-text',
    defaultMessage: 'Þessi stilling verður virk til {date}',
  },
  cancel: {
    id: 'sp.restrictions:modal-cancel',
    defaultMessage: 'Hætta við',
  },
  confirm: {
    id: 'sp.restrictions:modal-confirm',
    defaultMessage: 'Staðfesta',
  },
  messageEnabledRestriction: {
    id: 'sp.restrictions:enabled-restriction',
    defaultMessage: 'Þú ert með virka takmörkun til {date}',
  },
  warningElectronicId: {
    id: 'sp.restrictions:warning-electronic-id',
    defaultMessage:
      'Aðeins er hægt að virkja takmarkanir við innskráningu með því að vera skráður inn með rafrænum skilríkjum í síma.',
  },
  invalidIntent: {
    id: 'sp.restrictions:invalid-intent',
    defaultMessage: 'Ógild aðgerð',
  },
  invalidDate: {
    id: 'sp.restrictions:invalid-date',
    defaultMessage: 'Dagsetning er ekki rétt',
  },
})
