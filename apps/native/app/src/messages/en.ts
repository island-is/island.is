import { TranslatedMessages } from './index'

export const en: TranslatedMessages = {
  // login
  'login.welcomeMessage': 'Log in to the app with electronic ID',
  'login.loginButtonText': 'Login',
  'login.languageButtonText': 'Íslenska',
  'login.needHelpButtonText': 'Need help?',
  'login.outdatedBrowserTitle': 'Outdated browser',
  'login.outdatedBrowserMessage': 'You have an unsupported browser version, please update it through the Play Store.',
  'login.outdatedBrowserUpdateButton': 'Update',
  'login.outdatedBrowserCancelButton': 'Cancel',
  'login.networkErrorTitle': 'Network error',
  'login.networkErrorMessage': '\nCould not contact the login service.\n\nPlease check your device internet connection or try again later.',

  // app lock
  'applock.title': 'Enter a 4-digit PIN',
  'applock.attempts': 'attempts left',

  // onboarding
  'onboarding.notifications.title':
    'Receive notifications of new documents as soon as they are received.',
  'onboarding.notifications.allowNotificationsButtonText':
    'Allow notifications',
  'onboarding.notifications.decideLaterButtonText': 'Decide later',
  'onboarding.appLock.title':
    'Screen lock ensures that no one can open the app except you.',
  'onboarding.appLock.choosePinButtonText': 'Choose PIN',
  'onboarding.pinCode.enterPin': 'Choose 4-digit PIN',
  'onboarding.pinCode.confirmPin': 'Confirm the 4-digit PIN',
  'onboarding.pinCode.goBackButtonText': 'Go back',
  'onboarding.pinCode.cancelButtonText': 'Cancel',
  'onboarding.pinCode.nonMatchingPinCodes': 'The numbers did not match',
  'onboarding.biometrics.title':
    'You can also use {biometricType} to access the app without entering a PIN.',
  'onboarding.biometrics.notEnrolled':
    "Your device supports {biometricType} but you haven't enrolled into it yet.",
  'onboarding.biometrics.useBiometricsButtonText': 'Use {biometricType}',
  'onboarding.biometrics.skipButtonText': 'Skip for now',
  'onboarding.biometrics.type.faceId': 'Face ID',
  'onboarding.biometrics.type.facialRecognition': 'facial recognition',
  'onboarding.biometrics.type.fingerprint': 'fingerprint',
  'onboarding.biometrics.type.iris': 'iris scanner',
  'onboarding.pinKeypad.accessibilityLabel.faceId': 'Use FaceID',
  'onboarding.pinKeypad.accessibilityLabel.iris': 'Use Iris',
  'onboarding.pinKeypad.accessibilityLabel.fingerprint': 'Use fingerprint',
  'onboarding.pinKeypad.accessibilityLabel.delete': 'Delete character',

  // user
  'user.screenTitle': 'User',
  'user.tabs.preferences': 'Settings',
  'user.tabs.personalInfo': 'Personal info',

  // user: settings
  'settings.infoBoxText': 'Configure your app preferences',
  'settings.accessibilityLayout.groupTitle': 'Layout and accessibility',
  'settings.accessibilityLayout.language': 'Language',
  'settings.accessibilityLayout.sytemDarkMode': 'Use system appearance',
  'settings.accessibilityLayout.darkMode': 'Dark mode',
  'settings.communication.groupTitle': 'Notifications and communication',
  'settings.communication.newDocumentsNotifications':
    'Get notifications of new documents',
  'settings.communication.appUpdatesNotifications':
    'Get notifications about app updates',
  'settings.communication.applicationsNotifications':
    'Get notifications about application status updates',
  'settings.security.groupTitle': 'Security and privacy',
  'settings.security.changePinLabel': 'Change PIN',
  'settings.security.changePinDescription': 'Choose a new 4-digit PIN number',
  'settings.security.useBiometricsLabel': 'Use {biometricType}',
  'settings.security.useBiometricsDescription':
    'With {biometricType} you don’t need to enter PIN',
  'settings.security.appLockTimeoutLabel': 'App lock timeout',
  'settings.security.appLockTimeoutDescription':
    'Time until app lock will appear',
  'settings.about.groupTitle': 'About',
  'settings.about.versionLabel': 'Version',
  'settings.about.logoutLabel': 'Logout',
  'settings.about.logoutDescription': 'You will have to login again',

  // user: personal info
  'user.natreg.infoBox': 'Your registration at Registers Iceland',
  'user.natreg.displayName': 'Display name',
  'user.natreg.nationalId': 'Social ID',
  'user.natreg.birthPlace': 'Birthplace',
  'user.natreg.legalResidence': 'Legal domicile',
  'user.natreg.gender': 'Gender',
  'user.natreg.genderValue': `{
    gender,
    select,
    FEMALE {Female}
    MALE {Male}
    TRANSGENDER {Transgender}
    MALE_MINOR {Boy}
    FEMALE_MINOR {Girl}
    TRANSGENDER_MINOR {Transgender}
    other {Unknown}
  }`,
  'user.natreg.maritalStatus': 'Marital status',
  'user.natreg.maritalStatusValue': `{
    maritalStatus,
    select,
    MARRIED {Married}
    UNMARRIED {Unmarried}
    WIDOWED {Widowed}
    SEPARATED {Separated}
    DIVORCED {Divorced}
    MARRIED_LIVING_SEPARATELY {Married}
    MARRIED_TO_FOREIGN_LAW_PERSON {Married}
    FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {Married}
    ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON {Married}
    other {Unknown}
  }`,
  'user.natreg.citizenship': 'Citizenship',
  'user.natreg.religion': 'Religion',

  // Home
  'home.screenTitle': 'Overview',
  'home.applicationsStatus': 'Applications',
  'home.notifications': 'Notifications',
  'home.welcomeText': 'Hi',
  'home.onboardingModule.card1':
    'This first version of the Ísland.is app allows you to access electronic documents and certificates from the public sector, receive notifications and see the status of your applications.',
  'home.onboardingModule.card2':
    'The app’s purpose is to provide faster access to your documents, applications, and other dealings with governmental institutions.',
  'home.onboardingModule.card3':
    'If you have comments or suggestions about something that is missing or that could be improved, feel free to contact us via email at',

  // inbox
  'inbox.screenTitle': 'Inbox',
  'inbox.bottomTabText': 'Inbox',
  'inbox.searchPlaceholder': 'Search...',
  'inbox.loadingText': 'Searching...',
  'inbox.resultText': 'results',
  'inbox.singleResultText': 'result',
  'inbox.noResultText': 'No results',
  'inbox.emptyListTitle': 'There are currently no documents',
  'inbox.emptyListDescription':
    'When you receive electronic documents from the government, they will appear here.',

  // wallet
  'wallet.screenTitle': 'Wallet',
  'wallet.bottomTabText': 'Wallet',
  'wallet.alertMessage':
    'To use certificates as valid credentials, you need to transfer them to Apple Wallet.',
  'wallet.emptyListTitle': 'There are currently no documents',
  'wallet.emptyListDescription':
    'When you get e.g. driving licenses, firearms licenses or fishing licenses from the government, they appear here.',

  // wallet pass
  'walletPass.screenTitle': 'Pass',
  'walletPass.lastUpdate': 'Last updated',

  // license scanner
  'licenseScanner.title': 'Scan barcode',
  'licenseScanner.helperMessage': 'Point device at barcode',
  'licenseScanner.awaitingPermission': 'Asking for camera permissions',
  'licenseScanner.noCameraAccess': 'Camera not available',
  'licenseScannerDetail.driverLicenseNumber': 'Driver license number',
  'licenseScannerDetail.invalidBarcode': 'Invalid barcode',
  'licenseScannerResult.androidHelp': 'Press button below the license to get updated barcode.',
  'licenseScannerResult.iosHelp': 'Press three-dot button below the license. Next, refresh the screen by pulling down from the center to update the barcode.',

  // license scan detail
  'licenseScanDetail.errorUnknown': 'Unknown error',
  'licenseScanDetail.errorNetwork': 'Network error',
  'licenseScanDetail.errorCodeMessage': `{
    errorCode,
    select,
    1 {License OK}
    2 {License barcode expired, Try to refresh the barcode and scan again}
    3 {No license info found}
    4 {Request contains some field errors}
    other {Unknown error}
  }`,
  'licenseScanDetail.errorTryToRefresh': 'Failed to validate driving license. Try to refresh the barcode and scan again.',
  'licenseScanDetail.barcodeExpired': 'License barcode expired. Try to refresh the barcode and scan again.',

  // license scan results
  'licenseScannerResult.loading': 'Loading data',
  'licenseScannerResult.error': 'Error in scanning',
  'licenseScannerResult.valid': 'Is valid',
  'licenseScannerResult.title': 'Driver license (IS)',
  'licenseScannerResult.errorMessage': 'Error message',
  'licenseScannerResult.name': 'Name',
  'licenseScannerResult.nationalId': 'National ID',
  'licenseScannerResult.birthDate': 'Birthdate',
  'licenseScannerResult.driverLicenseNumber': 'Driver license number',

  // notifications
  'notifications.screenTitle': 'Notifications',

  // notification detail
  'notificationDetail.screenTitle': 'Notification',

  // document detail
  'documentDetail.screenTitle': 'Document',
  'documentDetail.loadingText': 'Loading document',

  // applications screen
  'applications.title': 'Applications',
  'applications.bottomTabText': 'Applications',
  'applications.searchPlaceholder': 'Search...',
  'applications.loadingText': 'Searching...',
  'applications.resultText': 'results',
  'applications.singleResultText': 'result',
  'applications.noResultText': 'No results',
  'applications.emptyListTitle': 'There are currently no links',
  'applications.emptyListDescription':
    'There are no links available at the moment',

  // cards
  'applicationStatusCard.openButtonLabel': 'Open application',
  'applicationStatusCard.seeMoreApplications': 'View applications',
  'applicationStatusCard.state': `{
    state,
    select,
    draft {Draft}
    missingInfo {Missing info}
    inReview {In review}
    approved {Approved}
    rejected {Rejected}
    other {Unknown status}
  }`,
  'applicationStatusCard.noActiveApplications': 'No active applications',
}
