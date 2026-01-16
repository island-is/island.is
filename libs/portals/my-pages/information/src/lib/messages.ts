import { defineMessages } from 'react-intl'

export const spmm = defineMessages({
  spouseIntro: {
    id: 'sp.family:data-info-spouse',
    defaultMessage: 'Hér fyrir neðan eru gögn um maka.',
  },
  childIntro: {
    id: 'sp.family:data-info-child',
    defaultMessage:
      'Hér fyrir neðan eru gögn um fjölskyldumeðlim. Þú hefur kost á að gera breytingar á eftirfarandi upplýsingum ef þú kýst.',
  },
  genderFemale: {
    id: 'sp.family:gender-female',
    defaultMessage: 'Kona',
  },
  genderFemaleMinor: {
    id: 'sp.family:gender-female-minor',
    defaultMessage: 'Stúlka',
  },
  genderMale: {
    id: 'sp.family:gender-male',
    defaultMessage: 'Karl',
  },
  genderMaleMinor: {
    id: 'sp.family:gender-male-minor',
    defaultMessage: 'Drengur',
  },
  genderTransgender: {
    id: 'sp.family:gender-transgender',
    defaultMessage: 'Kynsegin',
  },
  genderUnknown: {
    id: 'sp.family:gender-unknown',
    defaultMessage: 'Ekki vitað',
  },
  child: {
    id: 'sp.family:child',
    defaultMessage: 'Barn',
  },
  parent: {
    id: 'sp.family:parent',
    defaultMessage: 'Foreldri',
  },
  custodians: {
    id: 'sp.family:custodians',
    defaultMessage: 'Forsjáraðilar',
  },
  custodyStatus: {
    id: 'sp.family:custody-status',
    defaultMessage: 'Staða forsjár',
  },
  spouse: {
    id: 'sp.family:spouse',
    defaultMessage: 'Maki',
  },
  spouseAccusative: {
    id: 'sp.family:spouse-accusative',
    defaultMessage: 'Maka',
  },
  maritalStatusDivorced: {
    id: 'sp.family:marital-status-divorced',
    defaultMessage: 'Skilin(n) að lögum',
  },
  maritalStatusForeignResidence: {
    id: 'sp.family:marital-status-foreign-residence',
    defaultMessage:
      'Íslendingur með lögheimili erlendis; í hjúskap með útlendingi sem ekki er á skrá',
  },
  maritalStatusIcelandicResidence: {
    id: 'sp.family:marital-status-icelandic-residence',
    defaultMessage:
      'Íslendingur með lögheimili á Íslandi (t.d. námsmaður eða sendiráðsmaður); í hjúskap með útlendingi sem ekki er á skrá',
  },
  maritalStatusMarried: {
    id: 'sp.family:marital-status-married',
    defaultMessage: 'Gift/ur eða staðfest samvist',
  },
  maritalStatusMarriedLivingSep: {
    id: 'sp.family:marital-status-living-sep',
    defaultMessage: 'Hjón ekki í samvistum',
  },
  cohabitationWithSpouse: {
    id: 'sp.family:cohabitation-with-spouse',
    defaultMessage: 'Í sambúð',
  },
  maritalStatusMarriedToForeign: {
    id: 'sp.family:marital-status-married-to-foreign',
    defaultMessage:
      'Íslendingur í hjúskap með útlendingi sem nýtur úrlendisréttar og verður því ekki skráður (t.d. varnarliðsmaður eða sendiráðsmaður)',
  },
  maritalStatusSeparated: {
    id: 'sp.family:marital-status-separated',
    defaultMessage: 'Skilin(n) að borði og sæng',
  },
  maritalStatusUnknown: {
    id: 'sp.family:marital-status-unknown',
    defaultMessage: 'Hjúskaparstaða óupplýst',
  },
  maritalStatusUnmarried: {
    id: 'sp.family:marital-status-unmarried',
    defaultMessage: 'Ógift/ur',
  },
  maritalStatusWidowed: {
    id: 'sp.family:marital-status-widowed',
    defaultMessage: 'Ekkill, ekkja',
  },
  userInfoDesc: {
    id: 'sp.family:user-info-description',
    defaultMessage:
      'Hér eru gögn um þig og fjölskyldu þína sem sótt eru til Þjóðskrár. Með því að smella á skoða upplýsingar er hægt að óska eftir breytingum á þeim upplýsingum.',
  },
  userFamilyMembersOnNumber: {
    id: 'sp.family:user-famly-on-nr',
    defaultMessage: 'Einstaklingar með sömu lögheimilistengsl',
  },
  childRegisterModalButton: {
    id: 'sp.family:child-registration-modal-button',
    defaultMessage: 'Gera athugasemd við skráningu',
  },
  givenName: {
    id: 'sp.family:person-given-name',
    defaultMessage: 'Eiginnafn',
  },
  middleName: {
    id: 'sp.family:person-middle-name',
    defaultMessage: 'Millinafn',
  },
  lastName: {
    id: 'sp.family:person-last-name',
    defaultMessage: 'Kenninafn',
  },
  changeInNationalReg: {
    id: 'sp.family:change-in-national-registry',
    defaultMessage: 'Breyta í Þjóðskrá',
  },
  seeInfo: {
    id: 'sp.family:see-info',
    defaultMessage: 'Skoða upplýsingar',
  },
  editLink: {
    id: 'sp.family:edit-link',
    defaultMessage: 'Breyta hjá Þjóðskrá',
  },
  legalResidenceTooltip: {
    id: 'sp.family:legal-residence-tooltip',
    defaultMessage: 'Götuheiti, Húsnúmer, Íbúðarnúmer, Póstnúmer, Sveitarfélag',
  },
})

export const mInformationNotifications = defineMessages({
  description: {
    id: 'sp.information-notifications:description',
    defaultMessage: 'Hér getur þú nálgast tilkynningar þínar.',
  },
  markAllRead: {
    id: 'sp.information-notifications:mark-all-read',
    defaultMessage: 'Merkja allt lesið',
  },
  allMarkedAsRead: {
    id: 'sp.information-notifications:all-marked-as-read',
    defaultMessage: 'Allar tilkynningar merktar lesnar',
  },
})

export const msg = defineMessages({
  email: {
    id: 'sp.settings:email',
    defaultMessage: 'Netfang',
  },
  saveEmail: {
    id: 'sp.settings:save-email',
    defaultMessage: 'Vista netfang',
  },
  add: {
    id: 'sp.settings:add',
    defaultMessage: 'Bæta við',
  },
  change: {
    id: 'sp.settings:change',
    defaultMessage: 'Breyta',
  },
  changeEmail: {
    id: 'sp.settings:change-email',
    defaultMessage: 'Breyta netfangi',
  },
  editEmailText: {
    id: 'sp.settings:edit-email-text',
    defaultMessage:
      'Með því að skrá netfangið þitt tryggir þú að tilkynningar berist til þín. Það netfang bætist sömuleiðis sjálfkrafa við allar umsóknir þínar á Ísland.is.',
  },
  saveTel: {
    id: 'sp.settings:save-tel',
    defaultMessage: 'Vista símanúmer',
  },
  tel: {
    id: 'sp.settings:tel',
    defaultMessage: 'Símanúmer',
  },
  changeTel: {
    id: 'sp.settings:change-tel',
    defaultMessage: 'Breyta símanúmeri',
  },
  editTelText: {
    id: 'sp.settings:edit-tel-text',
    defaultMessage:
      'Með því að skrá símanúmerið þitt bætist það sjálfkrafa við allar umsóknir þínar á Ísland.is.',
  },
  editBankInfoText: {
    id: 'sp.settings:edit-bankInfo-text',
    defaultMessage:
      'Hér getur þú gert breytingar á þeim bankareikningi sem þú vilt að Fjársýsla ríkisins noti til endurgreiðslu.',
  },
  editNudgeText: {
    id: 'sp.settings:edit-nudge-text',
    defaultMessage: `Stofnanir munu senda þér tilkynningu þegar þín bíða mikilvæg skilaboð í pósthólfinu.`,
  },
  editPaperMailText: {
    id: 'sp.settings:edit-paper-mail-text',
    defaultMessage: `Hér getur þú óskað eftir því að erindi frá hinu opinbera sem birtast í stafræna pósthólfinu þínu verði jafnframt send til þín í bréfpósti.`,
  },
  overlayIntro: {
    id: 'sp.settings:overlay-intro-text',
    defaultMessage: `Við komum til með að senda á þig mikilvægar tilkynningar og því er gott að vera með netfang og síma rétt skráð.`,
  },
  companysSettingsIntro: {
    id: 'sp.settings:company-settings-intro-text',
    defaultMessage: `Hér getur þú breytt upplýsingum um fyrirtækið`,
  },
  dropModalAllTitle: {
    id: 'sp.settings:dropmodal-all-title',
    defaultMessage: 'Engar upplýsingar skráðar',
  },
  dropModalAllText: {
    id: 'sp.settings:dropmodal-all-text',
    defaultMessage:
      'Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með netfang og símanúmer skráð.',
  },
  dropModalEmailTitle: {
    id: 'sp.settings:dropmodal-email-title',
    defaultMessage: 'Engar netfangs upplýsingar skráðar',
  },
  dropModalEmailText: {
    id: 'sp.settings:dropmodal-email-text',
    defaultMessage: `Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með netfang skráð.`,
  },
  dropModalTelTitle: {
    id: 'sp.settings:dropmodal-tel-title',
    defaultMessage: 'Engar símanúmers upplýsingar skráðar',
  },
  dropModalTelText: {
    id: 'sp.settings:dropmodal-tel-text',
    defaultMessage: `Við komum til með að senda á þig staðfestingar og tilkynningar og því er gott að vera með símanúmer skráð.`,
  },
  dropModalContinue: {
    id: 'sp.settings:dropmodal-continue-button',
    defaultMessage: 'Skrá',
  },
  dropModalDrop: {
    id: 'sp.settings:dropmodal-drop-button',
    defaultMessage: 'Vil ekki skrá',
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
  errorBankInfoService: {
    id: 'sp.settings:bankInfo-service',
    defaultMessage: `Villa við að vista þennan reikning á þína kennitölu`,
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
  contactNotVerified: {
    id: 'sp.settings:contact-not-verified',
    defaultMessage: '{contactType} ekki staðfest',
  },
  contactNotVerifiedDescription: {
    id: 'sp.settings:contact-not-verified-description',
    defaultMessage:
      'Staðfestu {contactType} svo að tilkynningar skili sér örugglega til þín.',
  },
  confirmContact: {
    id: 'sp.settings:confirm-contact',
    defaultMessage: 'Staðfesta {contactType}',
  },
})

export const urls = defineMessages({
  editChild: {
    id: 'sp.family:url-edit-registration-child',
    defaultMessage:
      'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=703760ac-686f-11e6-943e-005056851dd2',
  },
  editResidenceChild: {
    id: 'sp.family:url-edit-residence-child',
    defaultMessage: 'https://skra.is/folk/flutningur/flutningur-barna/',
  },
  editChildReligion: {
    id: 'sp.family:url-edit-religion-child',
    defaultMessage:
      'https://www.skra.is/umsoknir/rafraen-skil/tru-eda-lifsskodunarfelag-barna-15-ara-og-yngri/',
  },
  editAdult: {
    id: 'sp.family:url-edit-registration-adult',
    defaultMessage:
      'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2',
  },
  editResidence: {
    id: 'sp.family:url-edit-residence-adult',
    defaultMessage:
      'https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/',
  },
  editReligion: {
    id: 'sp.family:url-edit-religion-adult',
    defaultMessage:
      'https://www.skra.is/umsoknir/rafraen-skil/tru-og-lifsskodunarfelag',
  },
  editBanmarking: {
    id: 'sp.family:url-edit-banmarking-adult',
    defaultMessage: 'https://www.skra.is/umsoknir/rafraen-skil/bannmerking/',
  },
  contactThjodskra: {
    id: 'sp.family:contact-thjodskra',
    defaultMessage: 'https://www.skra.is/um-okkur/hafa-samband/',
  },
})

export const mCompany = defineMessages({
  subtitle: {
    id: 'sp.company:company-subtitle',
    defaultMessage:
      'Hér má nálgast upplýsingar úr fyrirtækjaskrá hjá Skattinum.',
  },
  name: {
    id: 'sp.company:name',
    defaultMessage: 'Nafn fyrirtækis',
  },
  registration: {
    id: 'sp.company:registration',
    defaultMessage: 'Stofnað/Skráð',
  },
  taxNr: {
    id: 'sp.company:tax-number',
    defaultMessage: 'Virðisaukaskattsnúmer',
  },
  operationForm: {
    id: 'sp.company:operation-form',
    defaultMessage: 'Rekstrarform',
  },
  industryClass: {
    id: 'sp.company:idustry-class',
    defaultMessage: 'ÍSAT Atvinnugreinaflokkun',
  },
})

export const mNotifications = defineMessages({
  intro: {
    id: 'sp.notifications:intro-text',
    defaultMessage:
      'Veldu hvernig þú vilt að stofnanir geti sent þér tilkynningar.',
  },
  emailNotifications: {
    id: 'sp.notifications:email-notifications',
    defaultMessage: 'Tilkynningar í tölvupósti',
  },
  emailNotificationsDescription: {
    id: 'sp.notifications:email-notifications-description',
    defaultMessage: 'Stofnanir geta sent þér tilkynningu með tölvupósti.',
  },
  emailNotificationsAriaLabel: {
    id: 'sp.notifications:email-notifications-aria-label',
    defaultMessage: 'Fá tilkynningar í tölvupósti?',
  },
  appNotifications: {
    id: 'sp.notifications:app-notifications',
    defaultMessage: 'Tilkynningar í Ísland.is appinu',
  },
  appNotificationsDescription: {
    id: 'sp.notifications:app-notifications-description',
    defaultMessage: 'Stofnanir geta sent þér tilkynniningar í Ísland.is appið.',
  },
  appNotificationsAriaLabel: {
    id: 'sp.notifications:app-notifications-aria-label',
    defaultMessage: 'Fá tilkynningar í Ísland.is appinu?',
  },
  delegations: {
    id: 'sp.notifications:delegations',
    defaultMessage: 'Umboð',
  },
  updateError: {
    id: 'sp.notifications:update-error',
    defaultMessage: 'Ekki tókst að vista stillingar',
  },
  noDelegationsTitle: {
    id: 'sp.notifications:no-delegations-title',
    defaultMessage: 'Engin umboð skráð',
  },
  noDelegationsDescriptions: {
    id: 'sp.notifications:no-delegations-description',
    defaultMessage: 'Stillingar fyrir umboð munu birtast hér.',
  },
  paperMailTitle: {
    id: 'sp.notifications:paper-mail-title',
    defaultMessage: 'Bréfpóstur',
  },
  paperMailDescription: {
    id: 'sp.notifications:paper-mail-description',
    defaultMessage:
      'Hér getur þú óskað eftir því að erindi frá hinu opinbera sem birtast í stafræna pósthólfinu þínu verði jafnframt send til þín í bréfpósti.',
  },
  paperMailAriaLabel: {
    id: 'sp.notifications:paper-mail-aria-label',
    defaultMessage: 'Fá tilkynningar í bréfpósti?',
  },
})

export const emailsMsg = defineMessages({
  registerEmail: {
    id: 'sp.settings:register-email',
    defaultMessage: 'Skrá netfang',
  },
  addEmail: {
    id: 'sp.settings:add-email',
    defaultMessage: 'Bæta við netfangi',
  },
  verificationCodeButtonAria: {
    id: 'sp.settings:verification-code-button-aria',
    defaultMessage: 'Valmynd fyrir staðfestingarkóða',
  },
  emails: {
    id: 'sp.settings:emails',
    defaultMessage: 'Netföng',
  },
  emailListText: {
    id: 'sp.settings:email-list-text',
    defaultMessage:
      'Hér er listi yfir netföng sem eru skráð hjá þér og umboðum tengt þér. Þú getur stillt {link}',
  },
  emailListTextLink: {
    id: 'sp.settings:email-list-text-link',
    defaultMessage: 'tilkynningar hér.',
  },
  close: {
    id: 'sp.settings:close',
    defaultMessage: 'Loka',
  },
  emailCardPopover: {
    id: 'sp.settings:email-card-popover',
    defaultMessage: 'Aðgerðalisti fyrir netfang',
  },
  emailMakePrimary: {
    id: 'sp.settings:email-make-primary',
    defaultMessage: 'Gera að aðalnetfangi',
  },
  emailDelete: {
    id: 'sp.settings:email-delete',
    defaultMessage: 'Eyða netfangi',
  },
  emailMakePrimarySuccess: {
    id: 'sp.settings:email-make-primary-success',
    defaultMessage: 'Aðalnetfangi breytt',
  },
  emailSetActorProfileSuccess: {
    id: 'sp.settings:email-set-actor-profile-success',
    defaultMessage: 'Netfang tengt umboði',
  },
  emailDeleteSuccess: {
    id: 'sp.settings:email-delete-success',
    defaultMessage: 'Netfangi eytt',
  },
  unverified: {
    id: 'sp.settings:unverified',
    defaultMessage: 'Óstaðfest',
  },
  connectedToDelegation: {
    id: 'sp.settings:connected_to_delegation',
    defaultMessage: 'Tengt umboði',
  },
  primary: {
    id: 'sp.settings:primary',
    defaultMessage: 'Aðalnetfang',
  },
  emailDeleteError: {
    id: 'sp.settings:email-delete-error',
    defaultMessage: 'Ekki tókst að eyða netfangi',
  },
  emailMakePrimaryError: {
    id: 'sp.settings:email-make-primary-error',
    defaultMessage: 'Ekki tókst að setja aðalnetfang',
  },
  emailSetActorProfileError: {
    id: 'sp.settings:email-set-actor-profile-error',
    defaultMessage: 'Ekki tókst að tengja netfang við umboð',
  },
  connectEmailToDelegation: {
    id: 'sp.settings:connect-email-to-delegation',
    defaultMessage: 'Tengja netfang við umboð',
  },
  confirmEmail: {
    id: 'sp.settings:confirm-email',
    defaultMessage: 'Staðfesta netfang',
  },
  cancel: {
    id: 'sp.settings:cancel',
    defaultMessage: 'Hætta við',
  },
  noCodeReceived: {
    id: 'sp.settings:no-code-received',
    defaultMessage: 'Fékk ekki sendan kóða?',
  },
  codeSentSuccess: {
    id: 'sp.settings:code-sent-success',
    defaultMessage: 'Kóði hefur verið sendur',
  },
  addEmailSuccess: {
    id: 'sp.settings:add-email-success',
    defaultMessage: 'Netfang skráð',
  },
  securityCode: {
    id: 'ids:security-code',
    defaultMessage: 'Öryggiskóði',
  },
  securityCodeSpecialIS: {
    id: 'sp.settings:security-code-special-is',
    defaultMessage: 'Öryggiskóði',
  },
  wrongCodeTitle: {
    id: 'sp.settings:wrong-code-title',
    defaultMessage: 'Rangur kóði sleginn inn',
  },
  confirm: {
    id: 'sp.settings:confirm',
    defaultMessage: 'Staðfesta',
  },
  ariaLabelVerifyingCode: {
    id: 'sp.settings:aria-label-verifying-code',
    defaultMessage: 'Staðfesta kóða',
  },
  ariaSubmitButtonDisabled: {
    id: 'sp.settings:aria-submit-button-disabled',
    defaultMessage: 'Staðfesta hnappur óvirkur, {label} vantar',
  },
  ariaLabelTwoFactorDigit: {
    id: 'ids:aria-label-two-factor-digit',
    defaultMessage:
      'Vinsamlega sláðu inn staðfestingarkóðann fyrir tölu {num}.',
  },
  ariaLabelTwoFactorDigitSimple: {
    id: 'ids:aria-label-two-factor-digit-simple',
    defaultMessage: 'Tala {num}',
  },
  securityCodeEmailIntro: {
    id: 'ids:security-code-email-intro',
    defaultMessage: 'Sláðu inn kóðann sem við sendum þér á {br}{email}',
  },
  errorOccured: {
    id: 'ids:error-occured',
    defaultMessage: 'Villa kom upp',
  },
  errorOccuredDescription: {
    id: 'ids:error-occured-description',
    defaultMessage: 'Ekki tókst að senda kóðann',
  },
  validateTwoFactorError: {
    id: 'ids:validate-two-factor-error',
    defaultMessage: 'Kóði er ekki á réttu formi',
  },
  noAttemptsLeftError: {
    id: 'ids:no-attempts-left-error',
    defaultMessage: 'Engar tilraunir eftir.',
  },
  emailAlreadyExists: {
    id: 'ids:email-already-exists',
    defaultMessage: 'Netfang er nú þegar til',
  },
})

export const contractsMessages = defineMessages({
  registerRentalAgreement: {
    id: 'sp.contracts:register-rental-agreement',
    defaultMessage: 'Skrá leigusamning',
  },
  contractsOverviewTitle: {
    id: 'sp.contracts:contracts-overview-title',
    defaultMessage: 'Samningar',
  },
  contractsOverviewSubtitle: {
    id: 'sp.contracts:contracts-overview-subtitle',
    defaultMessage:
      'Hér finnur þú upplýsingar um þína samninga úr leiguskrá Húsnæðis og Mannvirkjastofnunar.',
  },
  contractDetailTitleFallback: {
    id: 'sp.contracts:contract-detail-title-fallback',
    defaultMessage: 'Samningur',
  },
  contractDetailSubtitle: {
    id: 'sp.contracts:contract-detail-subtitle',
    defaultMessage: 'Leigusamningur vegna íbúðarhúsnæðis',
  },
  dataStackTitle: {
    id: 'sp.contracts:data-stack-title',
    defaultMessage: 'Upplýsingar',
    description: 'Title for display of data contained in the rental agreement',
  },
  agreementNumber: {
    id: 'sp.contracts:agreement-number',
    defaultMessage: 'Samningsnúmer',
  },
  landlords: {
    id: 'sp.contracts:landlords',
    defaultMessage: 'Leigusalar',
  },
  tenants: {
    id: 'sp.contracts:tenants',
    defaultMessage: 'Leigjendur',
  },
  location: {
    id: 'sp.contracts:location',
    defaultMessage: 'Staðsetning',
  },
  lengthOfRentalAgreement: {
    id: 'sp.contracts:length-of-rental-agreement',
    defaultMessage: 'Leigutími',
  },
  registrationDate: {
    id: 'sp.contracts:registration-date',
    defaultMessage: 'Skráning',
  },
  status: {
    id: 'sp.contracts:status',
    defaultMessage: 'Staða',
  },
  inProgress: {
    id: 'sp.contracts:in-progress',
    defaultMessage: 'Í vinnslu',
  },
  active: {
    id: 'sp.contracts:active',
    defaultMessage: 'Í gildi',
  },
  cancelled: {
    id: 'sp.contracts:cancelled',
    defaultMessage: 'Rift',
  },
  expired: {
    id: 'sp.contracts:expired',
    defaultMessage: 'Útrunninn',
  },
  unknown: {
    id: 'sp.contracts:unknown',
    defaultMessage: 'Óþekkt',
  },
  terminated: {
    id: 'sp.contracts:terminated',
    defaultMessage: 'Sagt upp',
  },
  pendingCancellation: {
    id: 'sp.contracts:pending-cancellation',
    defaultMessage: 'Bíður riftunar',
  },
  pendingTermination: {
    id: 'sp.contracts:pending-termination',
    defaultMessage: 'Bíður uppsagnar',
  },
  seeInfo: {
    id: 'sp.contracts:see-info',
    defaultMessage: 'Skoða upplýsingar',
  },
  recordsFound: {
    id: 'sp.contracts:records-found',
    defaultMessage:
      '{count, plural, one {# samningur fannst} other {# samningar fundust}}',
  },
  hideInactiveContracts: {
    id: 'sp.contracts:hide-inactive-contracts',
    defaultMessage: 'Fela óvirka samninga',
  },
  downloadAsPdf: {
    id: 'sp.contracts:download-as-pdf',
    defaultMessage: 'Sækja sem PDF',
  },
  terminateRentalAgreement: {
    id: 'sp.contracts:terminate-rental-agreement',
    defaultMessage: 'Afskrá leigusamning',
  },
  extendRentalAgreement: {
    id: 'sp.contracts:extend-rental-agreement',
    defaultMessage: 'Framlengja leigusamning',
  },
  indefinite: {
    id: 'sp.contracts:indefinite',
    defaultMessage: 'Ótímabundinn',
  },
  temporary: {
    id: 'sp.contracts:temporary',
    defaultMessage: 'Tímabundinn',
  },
  typeIndividualRoom: {
    id: 'sp.contracts:type-individual-room',
    defaultMessage: 'Leigusamningur vegna herbergis',
    description: 'The type of property being rented out',
  },
  typeResidential: {
    id: 'sp.contracts:type-residential',
    defaultMessage: 'Leigusamningur vegna íbúðarhúsnæðis',
    description: 'The type of property being rented out',
  },
  typeNonResidential: {
    id: 'sp.contracts:type-non-residential',
    defaultMessage:
      'Leigusamningur vegna atvinnuhúsnæðis sem er nýtt til íbúðar',
    description: 'The type of property being rented out',
  },
})
