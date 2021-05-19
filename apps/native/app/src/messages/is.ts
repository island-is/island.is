// Source of truth for other languages
export const is = {
  // login
  "login.welcomeMessage": "Skráðu þig inn í appið með rafrænum skilríkjum",
  "login.loginButtonText": "Skrá inn",
  "login.languageButtonText": "English",
  "login.needHelpButtonText": "Þarftu hjálp",

  // onboarding
  "onboarding.notifications.title": "Fáðu tilkynningar um ný rafræn skjöl um leið og þau berast.",
  "onboarding.notifications.allowNotificationsButtonText": "Leyfa tilkynningar",
  "onboarding.notifications.decideLaterButtonText": "Ákveða seinna",
  "onboarding.appLock.title": "Skjálæsing tryggir að enginn geti opnað appið nema þú.",
  "onboarding.appLock.choosePinButtonText": "Velja PIN",
  "onboarding.pinCode.enterPin": "Veldu 4-tölustafa PIN",
  "onboarding.pinCode.confirmPin": "Staðfestu PIN númerið",
  "onboarding.pinCode.goBackButtonText": "Til baka",
  "onboarding.pinCode.cancelButtonText": "Hætta við",
  "onboarding.pinCode.nonMatchingPinCodes": "Númerin pössuðu ekki saman",
  "onboarding.biometrics.title": "Þú getur einnig notað {biometricType} til að opna appið án þess að slá inn PIN.",
  "onboarding.biometrics.notEnrolled": "Þitt tæki styður {biometricType} en þú hefur ekki virkt það.",
  "onboarding.biometrics.useBiometricsButtonText": "Nota {biometricType}",
  "onboarding.biometrics.skipButtonText": "Sleppa því í bili",
  "onboarding.biometrics.type.faceId": "Face ID",
  "onboarding.biometrics.type.facialRecognition": 'andlitsgreiningu',
  "onboarding.biometrics.type.fingerprint": "fingrafar",
  "onboarding.biometrics.type.iris": "augnskanna",

  // user
  "user.screenTitle": "Notandi",
  "user.tabs.preferences": "Stillingar",
  "user.tabs.personalInfo": "Persónuupplýsingar",

  // user: settings
  "settings.infoBoxText": "Stillingar á virkni og útliti appsins",
  "settings.accessibilityLayout.groupTitle": "Útlit og aðgengi",
  "settings.accessibilityLayout.language": "Tungumál",
  "settings.accessibilityLayout.sytemDarkMode": "Nota útlit stýrikerfis",
  "settings.accessibilityLayout.darkMode": "Nota dökkt útlit",
  "settings.communication.groupTitle": "Tilkynningar og samskipti",
  "settings.communication.newDocumentsNotifications": "Fá tilkynningar um ný skjöl",
  "settings.communication.appUpdatesNotifications": "Fá tilkynningar um nýjungar í appinu",
  "settings.communication.applicationsNotifications": "Fá tilkynningar um stöðu umsókna",
  "settings.security.groupTitle": "Öryggi og persónuvernd",
  "settings.security.changePinLabel": "Breyta PIN",
  "settings.security.changePinDescription": "Veldu nýtt 4-stafa PIN númer",
  "settings.security.useBiometricsLabel": "Nota {biometricType}",
  "settings.security.useBiometricsDescription": "Þannig sleppur þú við að nota PIN númerið",
  "settings.security.appLockTimeoutLabel": "Biðtími skjálæsingar",
  "settings.security.appLockTimeoutDescription": "Tíminn þar til skjálæsing fer í gang",
  "settings.about.groupTitle": "Um appið",
  "settings.about.versionLabel": "Útgáfa",
  "settings.about.logoutLabel": "Útskrá",
  "settings.about.logoutDescription": "Þú þarft að skrá þig inn aftur",

  // user: personal info
  "user.natreg.infoBox": "Þín skráning í Þjóðskrá Íslands",
  "user.natreg.displayName": "Birtingarnafn",
  "user.natreg.nationalId": "Kennitala",
  "user.natreg.birthPlace": "Fæðingastaður",
  "user.natreg.legalResidence": "Lögheimili",
  "user.natreg.gender": "Kyn",
  "user.natreg.genderValue": `{
    gender,
    select,
    FEMALE {Kona}
    MALE {Karl}
    TRANSGENDER {Kynsegin}
    MALE_MINOR {Drengur}
    FEMALE_MINOR {Stúlka}
    TRANSGENDER_MINOR {Kynsegin}
    UNKNOWN {Óupplýst}
  }`,
  "user.natreg.maritalStatus": "Hjúskaparstaða",
  "user.natreg.maritalStatusValue": `{
    maritalStatus,
    select,
    MARRIED {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    UNMARRIED {{gender, select, FEMALE {Ógift} MALE {Ógiftur}}}
    WIDOWED {{gender, select, FEMALE {Ekkja} MALE {Ekkill}}}
    SEPARATED {{gender, select, FEMALE {Aðskilin} MALE {Aðskilinn}}}
    DIVORCED {{gender, select, FEMALE {Fráskilin} MALE {Fráskilinn}}}
    MARRIED_LIVING_SEPARATELY {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    MARRIED_TO_FOREIGN_LAW_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    UNKNOWN {Óupplýst}
    FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur}}}
    ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur}}}
  }`,
  "user.natreg.citizenship": "Ríkisfang",
  "user.natreg.religion": "Trú- eða lífskoðunarfélag",

  // home
  "home.screenTitle": "Yfirlit",
  "home.applicationsStatus": "Staða umsókna",
  "home.notifications": "Tilkynningar",
  "home.welcomeText": "Hæ",

  // inbox
  "inbox.screenTitle": "Skjöl",
  "inbox.bottomTabText": "Skjöl",

  // document detail
  "documentDetail.screenTitle": "Skjal",

  // wallet
  "wallet.screenTitle": "Skírteini",
  "wallet.bottomTabText": "Skírteini",

  // notifications
  "notifications.screenTitle": "Tilkynningar",

  // notification detail
  "notificationDetail.screenTitle": "Tilkynning"
}
