import { defineMessages } from 'react-intl'

export const msg = defineMessages({
  saveEmail: {
    id: 'sp.settings:save-email',
    defaultMessage: 'Vista netfang',
  },
  editEmailText: {
    id: 'sp.settings:edit-email-text',
    defaultMessage:
      'Vinsamlega settu inn netfangið þitt. Við komum til með að senda á þig staðfestingar og tilkynningar.',
  },
  saveTel: {
    id: 'sp.settings:save-tel',
    defaultMessage: 'Vista símanúmer',
  },
  editTelText: {
    id: 'sp.settings:edit-tel-text',
    defaultMessage:
      'Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með rétt númer skráð. Endilega skráðu númerið þitt hér fyrir neðan og við sendum þér öryggiskóða til staðfestingar.',
  },
  editBankInfoText: {
    id: 'sp.settings:edit-bankInfo-text',
    defaultMessage: `
    Hér getur þú gert breytingar á þeim bankareikningi
    sem þú vilt nota í kerfum island.is.
  `,
  },
  editNudgeText: {
    id: 'sp.settings:edit-nudge-text',
    defaultMessage: `
    Hér getur þú gert breytingar á hnipp möguleikum. 
    Hnipp stillingar segja til um hvort þú viljir að Island.is láti 
    þig vita þegar eitthvað markvert gerist.
  `,
  },
  overlayIntro: {
    id: 'sp.settings:overlay-intro-text',
    defaultMessage: `Vinsamlegast farðu vel yfir allar neðangreindar upplýsingar, gakktu í
    skugga um að þær séu réttar og gerðu breytingar ef þörf krefur.`,
  },
  dropModalAllTitle: {
    id: 'sp.settings:dropmodal-all-title',
    defaultMessage:
      'Ertu alveg viss um að þú viljir ekki skrá netfang og/eða síma?',
  },
  dropModalAllText: {
    id: 'sp.settings:dropmodal-all-text',
    defaultMessage: `Ertu viss um þú viljir halda áfram án þess að skrá símanúmer eða
    netfang? Við komum til með að senda á þig staðfestingar og tilkynningar
    og því er gott að vera með rétt númer og netfang skráð`,
  },
  dropModalEmailTitle: {
    id: 'sp.settings:dropmodal-email-title',
    defaultMessage: 'Ertu alveg viss um að þú viljir ekki skrá netfang?',
  },
  dropModalEmailText: {
    id: 'sp.settings:dropmodal-email-text',
    defaultMessage: `Ertu viss um þú viljir halda áfram án þess að skrá
    netfang? Við komum til með að senda á þig staðfestingar og tilkynningar
    og því er gott að vera með rétt netfang skráð`,
  },
  dropModalTelTitle: {
    id: 'sp.settings:dropmodal-tel-title',
    defaultMessage: 'Ertu alveg viss um að þú viljir ekki skrá síma?',
  },
  dropModalTelText: {
    id: 'sp.settings:dropmodal-tel-text',
    defaultMessage: `Ertu viss um þú viljir halda áfram án þess að skrá
    síma? Við komum til með að senda á þig staðfestingar og tilkynningar
    og því er gott að vera með rétt símanúmer skráð`,
  },
  dropModalContinue: {
    id: 'sp.settings:dropmodal-continue-button',
    defaultMessage: 'Ég vil skrá upplýsingar',
  },
  dropModalDrop: {
    id: 'sp.settings:dropmodal-drop-button',
    defaultMessage: 'Ég vil halda áfram',
  },
  errorOnlyNumbers: {
    id: 'sp.settings:only-numbers-allowed',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  errorBankInputMaxLength: {
    id: 'sp.settings:bankInfo-required-length-msg',
    defaultMessage: `Númer banka er í mesta lagi 4 stafir`,
  },
  errorLedgerInputMaxLength: {
    id: 'sp.settings:bankInfo-hb-required-length-msg',
    defaultMessage: `Höfuðbók er í mesta lagi 2 stafir`,
  },
  errorAccountInputMaxLength: {
    id: 'sp.settings:bankInfo-account-required-length-msg',
    defaultMessage: `Reikningsnúmer er í mesta lagi 6 stafir.`,
  },
  inputBankLabel: {
    id: 'sp.settings:bankInfo-input-bank',
    defaultMessage: `Banki`,
  },
  inputLedgerLabel: {
    id: 'sp.settings:bankInfo-input-hb',
    defaultMessage: `Hb.`,
  },
  inputAccountNrLabel: {
    id: 'sp.settings:bankInfo-input-accountNr',
    defaultMessage: `Reikningsnúmer`,
  },
  buttonAccountSave: {
    id: 'sp.settings:bankInfo-button-save',
    defaultMessage: `Vista reikningsnúmer`,
  },
  buttonChange: {
    id: 'sp.settings:button-change',
    defaultMessage: `Breyta`,
  },
  saveSettings: {
    id: 'sp.settings:save-settings',
    defaultMessage: `Vista stillingar`,
  },
  errorTelReqLength: {
    id: 'sp.settings:tel-required-length-msg',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  saveEmptyChange: {
    id: 'sp.settings:save-empty',
    defaultMessage: 'Vista tómt',
  },
})
