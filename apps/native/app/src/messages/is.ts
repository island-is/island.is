// Source of truth for other languages
export const is = {
  // login
  'login.welcomeMessage': 'Skráðu þig inn í appið með rafrænum skilríkjum',
  'login.loginButtonText': 'Skrá inn',
  'login.languageButtonText': 'English',
  'login.needHelpButtonText': 'Þarftu aðstoð?',
  'login.outdatedBrowserTitle': 'Gamall vafri',
  'login.outdatedBrowserMessage': 'Vafrinn þinn er of gamall, vinsamlegast uppfærið hann í gegnum Play Store',
  'login.outdatedBrowserUpdateButton': 'Uppfæra',
  'login.outdatedBrowserCancelButton': 'Hætta við',
  'login.networkErrorTitle': 'Villa kom upp',
  'login.networkErrorMessage': '\nEkki náðist samband við innskráningarþjónustu.\n\nVinsamlegast athugið netsamband á tækinu eða reynið aftur síðar.',

  // app lock
  'applock.title': 'Sláðu inn 4 tölustafa PIN',
  'applock.attempts': 'tilraunir eftir',

  // onboarding
  'onboarding.notifications.title':
    'Fáðu tilkynningar um ný rafræn skjöl um leið og þau berast.',
  'onboarding.notifications.allowNotificationsButtonText': 'Leyfa tilkynningar',
  'onboarding.notifications.decideLaterButtonText': 'Ákveða seinna',
  'onboarding.appLock.title':
    'Skjálæsing tryggir að enginn geti opnað appið nema þú.',
  'onboarding.appLock.choosePinButtonText': 'Velja PIN',
  'onboarding.pinCode.enterPin': 'Veldu 4 tölustafa PIN',
  'onboarding.pinCode.confirmPin': 'Staðfestu PIN-númerið',
  'onboarding.pinCode.goBackButtonText': 'Til baka',
  'onboarding.pinCode.cancelButtonText': 'Hætta við',
  'onboarding.pinCode.nonMatchingPinCodes': 'Númerin pössuðu ekki saman',
  'onboarding.biometrics.title':
    'Þú getur einnig notað {biometricType} til að opna appið án þess að slá inn PIN.',
  'onboarding.biometrics.notEnrolled':
    'Tækið þitt styður {biometricType} en þú hefur ekki virkjað það.',
  'onboarding.biometrics.useBiometricsButtonText': 'Nota {biometricType}',
  'onboarding.biometrics.skipButtonText': 'Sleppa því í bili',
  'onboarding.biometrics.type.faceId': 'Face ID',
  'onboarding.biometrics.type.facialRecognition': 'andlitsgreiningu',
  'onboarding.biometrics.type.fingerprint': 'fingrafar',
  'onboarding.biometrics.type.iris': 'augnskanna',
  'onboarding.pinKeypad.accessibilityLabel.iris': 'Nota augnskannaauðkenningu',
  'onboarding.pinKeypad.accessibilityLabel.fingerprint': 'Nota fingrafarsauðkenningu',
  'onboarding.pinKeypad.accessibilityLabel.faceId': 'Nota andlitsauðkenningu',
  'onboarding.pinKeypad.accessibilityLabel.delete': 'Eyða staf',

  // user
  'user.screenTitle': 'Notandi',
  'user.tabs.preferences': 'Stillingar',
  'user.tabs.personalInfo': 'Persónuupplýsingar',

  // user: settings
  'settings.infoBoxText': 'Stillingar á virkni og útliti appsins',
  'settings.accessibilityLayout.groupTitle': 'Útlit og aðgengi',
  'settings.accessibilityLayout.language': 'Tungumál',
  'settings.accessibilityLayout.sytemDarkMode': 'Nota útlit stýrikerfis',
  'settings.accessibilityLayout.darkMode': 'Nota dökkt útlit',
  'settings.communication.groupTitle': 'Tilkynningar og samskipti',
  'settings.communication.newDocumentsNotifications':
    'Fá tilkynningar um ný skjöl',
  'settings.communication.appUpdatesNotifications':
    'Fá tilkynningar um nýjungar í appinu',
  'settings.communication.applicationsNotifications':
    'Fá tilkynningar um stöðu umsókna',
  'settings.security.groupTitle': 'Öryggi og persónuvernd',
  'settings.security.changePinLabel': 'Breyta PIN',
  'settings.security.changePinDescription': 'Veldu nýtt 4 stafa PIN-númer',
  'settings.security.useBiometricsLabel': 'Nota {biometricType}',
  'settings.security.useBiometricsDescription':
    'Þannig sleppur þú við að nota PIN-númerið',
  'settings.security.appLockTimeoutLabel': 'Biðtími skjálæsingar',
  'settings.security.appLockTimeoutDescription':
    'Tíminn þar til skjálæsing fer í gang',
  'settings.about.groupTitle': 'Um appið',
  'settings.about.versionLabel': 'Útgáfa',
  'settings.about.logoutLabel': 'Útskrá',
  'settings.about.logoutDescription': 'Þú þarft að skrá þig inn aftur',

  // user: personal info
  'user.natreg.infoBox': 'Þín skráning í Þjóðskrá Íslands',
  'user.natreg.displayName': 'Birtingarnafn',
  'user.natreg.nationalId': 'Kennitala',
  'user.natreg.birthPlace': 'Fæðingarstaður',
  'user.natreg.legalResidence': 'Lögheimili',
  'user.natreg.gender': 'Kyn',
  'user.natreg.genderValue': `{
    gender,
    select,
    FEMALE {Kona}
    MALE {Karl}
    TRANSGENDER {Kynsegin}
    MALE_MINOR {Drengur}
    FEMALE_MINOR {Stúlka}
    TRANSGENDER_MINOR {Kynsegin}
    other {Óupplýst}
  }`,
  'user.natreg.maritalStatus': 'Hjúskaparstaða',
  'user.natreg.maritalStatusValue': `{
    maritalStatus,
    select,
    MARRIED {{gender, select, FEMALE {Gift} MALE {Giftur} other {Óupplýst}}}
    UNMARRIED {{gender, select, FEMALE {Ógift} MALE {Ógiftur} other {Óupplýst}}}
    WIDOWED {{gender, select, FEMALE {Ekkja} MALE {Ekkill} other {Óupplýst}}}
    SEPARATED {{gender, select, FEMALE {Skilin að borði og sæng} MALE {Skilinn að borði og sæng} other {Óupplýst}}}
    DIVORCED {{gender, select, FEMALE {Fráskilin} MALE {Fráskilinn} other {Óupplýst}}}
    MARRIED_LIVING_SEPARATELY {{gender, select, FEMALE {Gift} MALE {Giftur} other {Óupplýst}}}
    MARRIED_TO_FOREIGN_LAW_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur} other {Óupplýst}}}
    FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur} other {Óupplýst}}}
    ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {{gender, select, FEMALE {Gift} MALE {Giftur} other {Óupplýst}}}
    other {Óupplýst}
  }`,
  'user.natreg.citizenship': 'Ríkisfang',
  'user.natreg.religion': 'Trú- eða lífsskoðunarfélag',

  // home
  'home.screenTitle': 'Yfirlit',
  'home.applicationsStatus': 'Staða umsókna',
  'home.notifications': 'Tilkynningar',
  'home.welcomeText': 'Hæ',
  'home.onboardingModule.card1':
    'Í þessari fyrstu útgáfu af Ísland.is appinu getur þú nálgast rafræn skjöl og skírteini frá hinu opinbera, fengið tilkynningar og séð stöðu umsókna.',
  'home.onboardingModule.card2':
    'Markmiðið með appinu er að þú hafir í hendi þér það sem þú þarfnast hverju sinni í samskiptum við hið opinbera.',
  'home.onboardingModule.card3':
    'Hafir þú athugasemdir eða ábendingar um eitthvað sem vantar eða sem má betur fara viljum við gjarnan fá frá þér línu á',

  // inbox
  'inbox.screenTitle': 'Skjöl',
  'inbox.bottomTabText': 'Skjöl',
  'inbox.searchPlaceholder': 'Leita að skjölum...',
  'inbox.loadingText': 'Leita í skjölum...',
  'inbox.resultText': 'niðurstöður fundust',
  'inbox.singleResultText': 'niðurstaða fannst',
  'inbox.noResultText': 'Engar niðurstöður fundust',
  'inbox.emptyListTitle': 'Hér eru engin skjöl sem stendur',
  'inbox.emptyListDescription':
    'Þegar þú færð send rafræn skjöl frá hinu opinbera birtast þau hér.',

  // document detail
  'documentDetail.screenTitle': 'Skjal',
  'documentDetail.loadingText': 'Sæki skjal',

  // wallet
  'wallet.screenTitle': 'Skírteini',
  'wallet.bottomTabText': 'Skírteini',
  'wallet.alertMessage':
    'Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet.',
  'wallet.emptyListTitle': 'Hér eru engin skírteini sem stendur',
  'wallet.emptyListDescription':
    'Þegar þú færð t.d. ökuskírteini, skotvopnaleyfi eða veiðikort frá hinu opinbera birtast þau hér.',

  // wallet pass
  'walletPass.screenTitle': 'Skírteini',
  'walletPass.lastUpdate': 'Síðast uppfært',

  // license scanner
  'licenseScanner.title': 'Skilríkjaskanni',
  'licenseScanner.helperMessage': 'Snúðu símanum að strikamerkinu',
  'licenseScanner.awaitingPermission': 'Bið um leyfi til að nota myndavél',
  'licenseScanner.noCameraAccess': 'Myndavél ekki aðgengileg',
  'licenseScannerDetail.driverLicenseNumber': 'Númer ökuskírteinis',

  // license scan detail
  'licenseScanDetail.errorUnknown': 'Óþekkt villa',
  'licenseScanDetail.errorNetwork': 'Net villa',
  'licenseScanDetail.errorCodeMessage': `{
    errorCode,
    select,
    1 {Skírteini í gildi}
    2 {Skírteini ekki í gildi}
    3 {Strikamerki óþekkt eða útrunnið, prófið að endurhlaða skírteini og skanna aftur}
    4 {Strikamerki ógilt}
    other {Óþekkt villa}
  }`,
  'licenseScanDetail.errorTryToRefresh': 'Villa við að sannreyna ökuskírteinið. Uppfærið skírteinið og reynið aftur.',
  'licenseScanDetail.barcodeExpired': 'Útrunnið strikamerki. Uppfærið skírteinið og reynið aftur.',

   // license scan results
   'licenseScannerResult.loading': 'Hleð upplýsingum',
   'licenseScannerResult.error': 'Villa við skönnun',
   'licenseScannerResult.valid': 'Í gildi',
   'licenseScannerResult.title': 'Ökuskírteini (IS)',
   'licenseScannerResult.errorMessage': 'Villuskilaboð',
   'licenseScannerResult.name': 'Nafn',
   'licenseScannerResult.birthDate': 'Fæðingardagur',
   'licenseScannerResult.nationalId': 'Kennitala',
   'licenseScannerResult.driverLicenseNumber': 'Númer ökuskírteinis',

  // notifications
  'notifications.screenTitle': 'Tilkynningar',

  // notification detail
  'notificationDetail.screenTitle': 'Tilkynning',

  // applications screen
  'applications.title': 'Umsóknir á Ísland.is',
  'applications.bottomTabText': 'Umsóknir',
  'applications.searchPlaceholder': 'Leita að skjölum...',
  'applications.loadingText': 'Leita í skjölum...',
  'applications.resultText': 'niðurstöður fundust',
  'applications.singleResultText': 'niðurstaða fannst',
  'applications.noResultText': 'Engar niðurstöður fundust',
  'applications.emptyListTitle': 'Hér eru engir linkar sem stendur',
  'applications.emptyListDescription':
    'Að einhverjum ástæðum þá eru engir linkar að umsóknum aðgengilegir eins og er',

  // cards
  'applicationStatusCard.openButtonLabel': 'Opna umsókn',
  'applicationStatusCard.state': `{
    state,
    select,
    draft {Drög}
    missingInfo {Vantar gögn}
    inReview {Í vinnslu}
    approved {Samþykkt}
    rejected {Hafnað}
    other {Staða óþekkt}
  }`,
  'applicationStatusCard.noActiveApplications':
    'Þegar þú stofnar stafræna umsókn á Ísland.is birtist staða hennar hér.',
}
