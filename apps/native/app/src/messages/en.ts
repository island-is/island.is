import {TranslatedMessages} from './index';

export const en: TranslatedMessages = {
  // login
  'login.welcomeMessage': 'Log in to the app with electronic ID',
  'login.loginButtonText': 'Login',
  'login.languageButtonText': 'Íslenska',
  'login.needHelpButtonText': 'Need help?',
  'login.outdatedBrowserTitle': 'Outdated browser',
  'login.outdatedBrowserMessage':
    'You have an unsupported browser version, please update it through the Play Store.',
  'login.outdatedBrowserUpdateButton': 'Update',
  'login.outdatedBrowserCancelButton': 'Cancel',
  'login.networkErrorTitle': 'Network error',
  'login.networkErrorMessage':
    '\nCould not contact the login service.\n\nPlease check your device internet connection or try again later.',

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
  'onboarding.biometrics.noAuthenticationTypes':
    'Your device does not support biometrics',
  'onboarding.biometrics.useBiometricsButtonText': 'Use {biometricType}',
  'onboarding.biometrics.skipButtonText': 'Skip for now',
  'onboarding.biometrics.type.faceId': 'Face ID',
  'onboarding.biometrics.type.biometrics': 'biometrics',
  'onboarding.biometrics.type.fingerprint': 'fingerprint',
  'onboarding.biometrics.type.iris': 'iris scanner',
  'onboarding.pinKeypad.accessibilityLabel.faceId': 'Use FaceID',
  'onboarding.pinKeypad.accessibilityLabel.iris': 'Use Iris',
  'onboarding.pinKeypad.accessibilityLabel.fingerprint': 'Use fingerprint',
  'onboarding.pinKeypad.accessibilityLabel.delete': 'Delete character',

  // peronal info screen
  'personalInfo.screenTitle': 'Personal info',

  // user
  'user.screenTitle': 'User',
  'user.tabs.preferences': 'Settings',
  'user.tabs.personalInfo': 'Personal info',

  // setting screen
  'setting.screenTitle': 'Settings',

  // user: settings
  'settings.infoBoxText': 'Configure your app preferences',
  'settings.accessibilityLayout.groupTitle': 'Layout and accessibility',
  'settings.accessibilityLayout.language': 'Language',
  'settings.accessibilityLayout.sytemDarkMode': 'Use system appearance',
  'settings.accessibilityLayout.darkMode': 'Dark mode',
  'settings.usersettings.groupTitle': 'My settings',
  'settings.usersettings.telephone': 'Telephone',
  'settings.usersettings.email': 'Email',
  'settings.usersettings.bankinfo': 'Bank info',
  'settings.communication.groupTitle': 'Notifications and communication',
  'settings.communication.newDocumentsNotifications':
    'Get notifications of new documents',
  'settings.communication.appUpdatesNotifications':
    'Get notifications about app updates',
  'settings.communication.applicationsNotifications':
    'Get notifications about application status updates',
  'settings.security.privacyTitle': 'Privacy Policy',
  'settings.security.privacySubTitle': 'Digital Iceland',
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
  'settings.about.codePushLabel': 'Updates',
  'settings.about.codePushLoading': 'Loading...',
  'settings.about.codePushUpToDate': 'The app is up to date',

  // user: personal info
  'user.natreg.infoBox': 'Your registration at Registers Iceland',
  'user.natreg.displayName': 'Full name',
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
  'home.allApplications': 'Digital applications',
  'home.notifications': 'Notifications',
  'home.welcomeText': 'Hi',
  'home.onboardingModule.card1':
    'Now you can see information about vehicles, assets and your family in the app in addition to documents and licenses.',
  'home.onboardingModule.card2':
    'The app’s purpose is to provide faster access to your documents, applications, and other dealings with governmental institutions.',
  'home.onboardingModule.card3':
    'If you have comments or suggestions about something that is missing or that could be improved, feel free to contact us via email at',
  'home.onboardingModule.card4':
    'We encourage our users to read Digital Iceland’s privacy policy on',

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
  'inbox.filterButtonTitle': 'Open filter',
  'inbox.filterOpenedTagTitle': 'Unread',
  'inbox.filterArchivedTagTitle': 'Archived',
  'inbox.filterStarredTagTitle': 'Starred',

  // inbox filters
  'inboxFilters.screenTitle': 'Filter documents',
  'inboxFilters.unreadOnly': 'Show only unread',
  'inboxFilters.starred': 'Starred',
  'inboxFilters.archived': 'Archived',

  // document detail
  'documentDetail.screenTitle': 'Document',
  'documentDetail.loadingText': 'Loading document',

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
  'walletPass.expirationDate': 'Expiration date',
  'walletPass.errorTitle': 'Error',
  'walletPass.errorNotPossibleToAddDriverLicense':
    'At the moment it is not possible to add driving licenses to the phone.',
  'walletPass.moreInfo': 'More information',
  'walletPass.alertClose': 'Cancel',

  // wallet passport
  'walletPassport.screenTitle': 'Passport',
  'walletPassport.infoTitle': 'Remember the passport!',
  'walletPassport.infoDescription':
    'This summary is not valid as a travel document.',
  'walletPassport.warningTitle': 'Expires within 6 months',
  'walletPassport.warningDescription':
    'Note that your passport will expire within the next 6 months.',
  'walletPassport.displayName': 'Name',
  'walletPassport.number': 'Number',
  'walletPassport.issuingDate': 'Date issued',
  'walletPassport.expirationDate': 'Expiration date',
  'walletPassport.mrzName': 'Machine-readable name',
  'walletPassport.children': 'Childrens passport',
  'walletPassport.noPassport': 'No passport.',
  'walletPassport.noPassportLink': 'Read more at island.is/vegabref',

  // license scanner
  'licenseScanner.title': 'Scan barcode',
  'licenseScanner.helperMessage': 'Point device at barcode',
  'licenseScanner.awaitingPermission': 'Asking for camera permissions',
  'licenseScanner.noCameraAccess': 'Camera not available',
  'licenseScannerDetail.driverLicenseNumber': 'Driver license number',
  'licenseScannerDetail.invalidBarcode': 'Invalid barcode',
  'licenseScannerResult.androidHelp':
    'Press button below the license to get updated barcode.',
  'licenseScannerResult.iosHelp':
    'Press three-dot button below the license. Next, refresh the screen by pulling down from the center to update the barcode.',

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
  'licenseScanDetail.errorTryToRefresh':
    'Failed to validate driving license. Try to refresh the barcode and scan again.',
  'licenseScanDetail.barcodeExpired':
    'License barcode expired. Try to refresh the barcode and scan again.',

  // license scan results
  'licenseScannerResult.loading': 'Loading data',
  'licenseScannerResult.error': 'Error in scanning',
  'licenseScannerResult.valid': 'Is valid',
  'licenseScannerResult.driverLicenseTitle': 'Driver license (IS)',
  'licenseScannerResult.firarmsLicenseTitle': 'Firearms license (IS)',
  'licenseScannerResult.adrLicenseTitle': 'ADR licens (IS)',
  'licenseScannerResult.vvrLicenseTitle': 'Vinnuvélaskírteini (IS)',
  'licenseScannerResult.errorMessage': 'Error message',
  'licenseScannerResult.name': 'Name',
  'licenseScannerResult.nationalId': 'National ID',
  'licenseScannerResult.birthDate': 'Birthdate',
  'licenseScannerResult.driverLicenseNumber': 'Driver license number',

  // notifications
  'notifications.screenTitle': 'Notifications',

  // notification detail
  'notificationDetail.screenTitle': 'Notification',

  // profile
  'profile.screenTitle': 'More',
  'profile.bottomTabText': 'More',
  'profile.seeInfo': 'See info',
  'profile.family': 'Family',
  'profile.vehicles': 'Vehicles',
  'profile.assets': 'Assets',
  'profile.finance': 'Finance',

  // vehicles
  'vehicles.screenTitle': 'Vehicles',
  'vehicles.emptyListTitle': 'No vehicles found for the user',
  'vehicles.emptyListDescription':
    'Vehicles registered to you will appear here.',

  // vehicles detail
  'vehicleDetail.regno': 'Registration number',
  'vehicleDetail.permno': 'Permanent number',
  'vehicleDetail.firstReg': 'First registration',
  'vehicleDetail.nextInspectionDate': 'Next main inspection',
  'vehicleDetail.color': 'Color',
  'vehicleDetail.insured': 'Insured',
  'vehicleDetail.insuredValue': `{
    isInsured,
    select,
    true {Yes}
    false {No}
    other {Unknown}
  }`,
  'vehicleDetail.unpaidVehicleFee': 'Unpaid vehicle tax',
  'vehicleDetail.trailerWithBrakes':
    'Permissible maximum towable mass of trailer (braked)',
  'vehicleDetail.trailerWithoutBrakes':
    'Permissible maximum towable mass of trailer (unbraked)',
  'vehicleDetail.nedc': 'Exhaust emissions value (NEDC)',
  'vehicleDetail.vehicleWeight': 'Vehicle weight',
  'vehicleDetail.totalWeight': 'Maximum weight',
  'vehicleDetail.capacityWeight': 'Road train weight',
  'vehicleDetail.odometer': 'Odometer',

  // assets overview
  'assetsOvervies.screenTitle': 'Assets',
  'assetsOverview.emptyListTitle': 'No assets found for the user',
  'assetsOverview.emptyListDescription':
    'Assets registered to you will appear here.',

  // assets details
  'assetsDetail.propertyNumber': 'Property number',
  'assetsDetail.displaySize': 'Size',
  'assetsDetail.activeAppraisal': 'Property appraisal {activeYear}',
  'assetsDetail.plannedAppraisal': 'Property appraisal {plannedYear}',
  'assetsDetail.explanation': 'Explanation',
  'assetsDetail.marking': 'Marking',
  'assetsDetail.municipality': 'Municipality',
  'assetsDetail.postNumber': 'Post number',
  'assetsDetail.buildYearDisplay': 'Build Year Display',

  // finance
  'finance.screenTitle': 'Finance',
  'finance.statusCard.status': 'Status',
  'finance.statusCard.paymentBase': 'Payment base',
  'finance.statusCard.deadline': 'Final due date',
  'finance.statusCard.amount': 'Amount',
  'finance.statusCard.total': 'Total',
  'finance.statusCard.organization': 'Contact information',
  'finance.statusCard.organizationWebsite': 'Website',
  'finance.statusCard.organizationEmail': 'Email',
  'finance.statusCard.organizationPhone': 'Phone',
  'finance.statusCard.schedulePaymentPlan': 'Make a payment schedule',
  'finance.heading.title': 'Financial standing with the government',
  'finance.heading.subtitle':
    'Here you can see an overview of your debt and/or credit balance with the government.',

  // finance detail
  'financeDetail.title': 'Detailed information',
  'financeDetail.paymentBase': 'Payment Base',
  'financeDetail.yearAndPeriod': `Year and period`,
  'financeDetail.dueDate': 'Due Date',
  'financeDetail.finalDueDate': 'Final due date',
  'financeDetail.principal': 'Principal',
  'financeDetail.interest': 'Interest',
  'financeDetail.costs': 'Costs',
  'financeDetail.payments': 'Payments',
  'financeDetail.status': 'Status',

  // family
  'family.screenTitle': 'Family',
  'family.emptyListTitle': 'Family information',
  'family.emptyListDescription':
    'Information about your family from the National Registry will appear here.',

  // family details
  'familyDetail.title': 'Info',
  'familyDetail.description': 'Here below are details about a family member',
  'familyDetail.natreg.displayName': 'Full name',
  'familyDetail.natreg.nationalId': 'Social ID',
  'familyDetail.natreg.familyRelation': 'Family Relation',
  'familyDetail.natreg.familyRelationValue': `{
    type,
    select,
    spouse {Spouse}
    child {Child}
    other {Óupplýst}
  }`,
  'familyDetail.natreg.citizenship': 'Citizenship',
  'familyDetail.natreg.birthPlace': 'Birthplace',
  'familyDetail.natreg.legalResidence': 'Legal domicile',
  'familyDetail.natreg.gender': 'Gender',

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
  'applicationStatusCard.status': `{
    state,
    select,
    inprogress {In progress}
    completed {Completed}
    rejected {Rejected}
    other {Unknown status}
  }`,
  'applicationStatusCard.noActiveApplications': 'No active applications',

  // edit phone
  'edit.phone.screenTitle': 'Edit Phone',
  'edit.phone.description': 'Here you can change your phone number',
  'edit.phone.inputlabel': 'Phone number',
  'edit.phone.button': 'Save',
  'edit.phone.button.empty': 'Save empty',
  'edit.phone.button.error': 'Error',
  'edit.phone.button.errorMessage': 'Could not send verification code',

  // edit email
  'edit.email.screenTitle': 'Edit Email',
  'edit.email.description': 'Here you can change your email',
  'edit.email.inputlabel': 'Email',
  'edit.email.button': 'Save',
  'edit.email.button.empty': 'Save empty',
  'edit.email.button.error': 'Error',
  'edit.email.button.errorMessage': 'Could not send verification code',

  // edit bank info
  'edit.bankinfo.screenTitle': 'Edit Bank Info',
  'edit.bankinfo.description':
    'Here you can make changes to the bank account that you want the National Administration of Finance to use for reimbursement',
  'edit.bankinfo.inputlabel.bank': 'Bank',
  'edit.bankinfo.inputlabel.book': 'Hb.',
  'edit.bankinfo.inputlabel.number': 'Account number',
  'edit.bankinfo.button': 'Save',

  // edit confirm
  'edit.confirm.screenTitle': 'Confirm edit',
  'edit.confirm.description': `Enter the security code that has been sent to {
    type,
    select,
    email {the email you have registered}
    phone {the phone number you have registered}
    other {to you}
  }.`,
  'edit.confirm.inputlabel': 'Security number',
  'edit.cancel.button': 'Cancel',
  'edit.confirm.button': 'Confirm',
};
