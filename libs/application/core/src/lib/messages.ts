import { defineMessages } from 'react-intl'

export const coreMessages = defineMessages({
  buttonNext: {
    id: 'application.system:button.next',
    defaultMessage: 'Halda áfram',
    description: 'Next',
  },
  buttonBack: {
    id: 'application.system:button.back',
    defaultMessage: 'Til baka',
    description: 'Back',
  },
  buttonSubmit: {
    id: 'application.system:button.submit',
    defaultMessage: 'Senda',
    description: 'Submit',
  },
  reviewButtonSubmit: {
    id: 'application.system:reviewButton.submit',
    defaultMessage: 'Vista',
    description: 'Save',
  },
  buttonApprove: {
    id: 'application.system:button.approve',
    defaultMessage: 'Samþykkja',
    description: 'Approve button copy',
  },
  buttonReject: {
    id: 'application.system:button.reject',
    defaultMessage: 'Hafna',
    description: 'Reject button copy',
  },
  buttonEdit: {
    id: 'application.system:button.edit',
    defaultMessage: 'Breyta',
    description: 'Edit button for review screen and so on',
  },
  buttonAdd: {
    id: 'application.system:button.add',
    defaultMessage: 'Bæta við',
    description: 'Add button',
  },
  buttonRemove: {
    id: 'application.system:button.remove',
    defaultMessage: 'Fjarlægja',
    description: 'Remove button',
  },
  buttonCancel: {
    id: 'application.system:button.cancel',
    defaultMessage: 'Hætta við',
    description: 'Cancel button',
  },
  cardButtonInProgress: {
    id: 'application.system:card.button.inProgress',
    defaultMessage: 'Opna umsókn',
    description: 'Button label when application is in progress',
  },
  cardButtonDraft: {
    id: 'application.system:card.button.Draft',
    defaultMessage: 'Opna umsókn',
    description: 'Button label when application is in draft',
  },
  cardButtonRejected: {
    id: 'application.system:card.button.Rejected',
    defaultMessage: 'Skoða yfirlit',
    description: 'Button label when application is rejected',
  },
  cardButtonApproved: {
    id: 'application.system:card.button.Approved',
    defaultMessage: 'Skoða yfirlit',
    description: 'Button label when application is approved',
  },
  cardButtonNotStarted: {
    id: 'application:card.button.notStarted',
    defaultMessage: 'Hefja umsókn',
    description: 'Button label when application is not started',
  },
  cardButtonComplete: {
    id: 'application.system:card.button.complete',
    defaultMessage: 'Skoða yfirlit',
    description: 'Button label when application is complete',
  },
  externalDataTitle: {
    id: 'application.system:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
    description:
      'The following data will be retrieved electronically with your consent',
  },
  externalDataAgreement: {
    id: 'application.system:externalData.agreement',
    defaultMessage: 'Ég samþykki',
    description: 'I agree',
  },
  updateOrSubmitError: {
    id: 'application.system:submit.error',
    defaultMessage: 'Eitthvað fór úrskeiðis: {error}',
    description: 'Error message on submit: {error}',
  },
  globalErrorTitle: {
    id: 'application.system:boundary.error.title',
    defaultMessage: 'Úps! Eitthvað fór úrskeiðis',
    description: 'Oops! Something went wrong',
  },
  globalErrorMessage: {
    id: 'application.system:boundary.error.message',
    defaultMessage:
      'Fyrirgefðu! Eitthvað fór rosalega úrskeiðis og við erum að skoða það',
    description:
      'Sorry! Something went terribly wrong and we are looking into it',
  },
  userRoleError: {
    id: 'application.system:user.role.error',
    defaultMessage:
      'Innskráður notandi hefur ekki hlutverk í þessu umsóknarástandi',
    description:
      'Logged in user does not have a role in this application state',
  },
  notFoundTitle: {
    id: 'application.system:notFound',
    defaultMessage: 'Umsókn finnst ekki',
    description: 'Application not found',
  },
  notFoundSubTitle: {
    id: 'application.system:notFound.message',
    defaultMessage: 'Engin umsókn fannst á þessari slóð.',
    description: 'No application was found at this URL.',
  },
  notFoundApplicationType: {
    id: 'application.system:notFound.application.type',
    defaultMessage: 'Þessi gerð umsókna er ekki til',
    description: 'This type of application does not exist',
  },
  notFoundApplicationTypeMessage: {
    id: 'application.system:notFound.application.message',
    defaultMessage: 'Engin umsókn er til af gerðinni: {type}',
    description: 'There is no application of the type: {type}',
  },
  createErrorApplication: {
    id: 'application.system:create.error.application',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Something went wrong',
  },
  createErrorApplicationMessage: {
    id: 'application.system:create.error.application.message',
    defaultMessage: 'Ekki tókst að búa til umsókn af gerðinni: {type}',
    description: 'Failed to create application of type: {type}',
  },
  nationalId: {
    id: 'application.system:nationalId',
    defaultMessage: 'Kennitala',
    description: 'National ID',
  },
  name: {
    id: 'application.system:name',
    defaultMessage: 'Nafn',
    description: 'Name',
  },
  applications: {
    id: 'application.system:applications',
    defaultMessage: 'Þínar umsóknir',
    description: 'Your applications',
  },
  newApplication: {
    id: 'application.system:new.application',
    defaultMessage: 'Ný umsókn',
    description: 'New application',
  },
  tagsInProgress: {
    id: 'application.system:tags.inProgress',
    defaultMessage: 'Í ferli',
    description: 'In progress status for an application',
  },
  tagsDone: {
    id: 'application.system:tags.completed',
    defaultMessage: 'Lokið',
    description: 'Done status for an application',
  },
  tagsRejected: {
    id: 'application.system:tags.rejected',
    defaultMessage: 'Hafnað',
    description: 'Rejected status for an application',
  },
  tagsApproved: {
    id: 'application.system:tags.approved',
    defaultMessage: 'Samþykkt',
    description: 'Approved status for an application',
  },
  tagsDraft: {
    id: 'application.system:tags.draft',
    defaultMessage: 'Umsókn í vinnslu hjá þér',
    description: 'Draft status for an application',
  },
  tagsRequiresAction: {
    id: 'application.system:tags.requiresAction',
    defaultMessage: 'Krefst aðgerða',
    description: 'Requires action',
  },
  thanks: {
    id: 'application.system:thanks',
    defaultMessage: 'Takk fyrir',
    description: 'Thank you',
  },
  thanksDescription: {
    id: 'application.system:thanks.description',
    defaultMessage:
      'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
    description:
      'Your application is complete. The application has progressed in the process.',
  },
  draftProgressMeter: {
    id: 'application.system:application.progress',
    defaultMessage:
      'Þú hefur klárað {draftFinishedSteps} af {draftTotalSteps} skrefum',
    description:
      'You have completed {draftFinishedSteps} of {draftTotalSteps} steps',
  },
  notLoggedIn: {
    id: 'application.system:not.logged.id',
    defaultMessage: 'Þú þarft að vera skrá þig inn.',
    description: 'You need to be logged in.',
  },
  notLoggedInDescription: {
    id: 'application.system:not.logged.id.description',
    defaultMessage: 'Til að halda áfram umsóknarferli þarftu að skrá þig inn.',
    description:
      'To continue the application process, you will need to sign in.',
  },
  radioYes: {
    id: 'application.system:radio.option.yes',
    defaultMessage: 'Já',
    description: 'Yes option value',
  },
  radioNo: {
    id: 'application.system:radio.option.no',
    defaultMessage: 'Nei',
    description: 'No option value',
  },
  paymentPollingIndicator: {
    id: 'application.system:core.payment.pollingIndicator',
    defaultMessage: 'Bíð staðfestingar frá greiðsluveitu',
    description:
      'Text indicating we are waiting for confirmation from 3rd party payment gateway',
  },
  deleteFieldText: {
    id: 'application.system:core.delete.field.text',
    defaultMessage: 'Eyða færslu',
    description: 'Delete field text',
  },
  editFieldText: {
    id: 'application.system:core.edit.field.text',
    defaultMessage: 'Breyta færslu',
    description: 'Edit field text',
  },
  deleteApplicationDialogTitle: {
    id: 'application.system:delete.application.dialog.title',
    defaultMessage: 'Eyða umsókn',
    description: 'Delete application dialog title',
  },
  deleteApplicationDialogDescription: {
    id: 'application.system:delete.application.dialog.description',
    defaultMessage: 'Ertu viss um að þú viljir eyða þessari umsókn?',
    description: 'Delete application dialog description',
  },
  deleteApplicationDialogConfirmLabel: {
    id: 'application.system:delete.application.dialog.confirm',
    defaultMessage: 'Já, eyða',
    description: 'Delete application dialog confirm',
  },
  deleteApplicationDialogCancelLabel: {
    id: 'application.system:delete.application.dialog.cancel',
    defaultMessage: 'Hætta við',
    description: 'Delete application dialog cancel',
  },
  openApplicationHistoryLabel: {
    id: 'application.system:core.history.open',
    defaultMessage: 'Opna umsóknarsögu',
    description: 'Open application history button',
  },
  closeApplicationHistoryLabel: {
    id: 'application.system:core.history.close',
    defaultMessage: 'Loka umsóknarsögu',
    description: 'Close application history button',
  },
  openServicePortalMessageText: {
    id: 'application.system:openServicePortal.messageText',
    defaultMessage:
      'Á Mínum síðum Ísland.is getur þú nálgast stöðu umsóknarinnar ásamt öðrum upplýsingum.',
    description:
      'Text for form builder component left side of button to go to the service portal',
  },
  openServicePortalButtonTitle: {
    id: 'application.system:openServicePortal.buttonTitle',
    defaultMessage: 'Opna Mínar síður',
    description: 'Button text for form builder component, go to service portal',
  },
  copyLinkSuccessToast: {
    id: 'application.system:copyLinkSuccessToast',
    defaultMessage: 'Hlekkur afritaður',
    description: 'Copy link success toast',
  },
  copyLinkButtonTitle: {
    id: 'application.system:copyLinkButtonTitle',
    defaultMessage: 'Afrita tengil',
    description: 'Copy link button title',
  },
})

export const coreDefaultFieldMessages = defineMessages({
  defaultFileUploadDescription: {
    id: 'application.system:core.default.fileUpload.description',
    defaultMessage:
      'Samþykktar skráartegundir eru .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
    description: 'Default file upload description',
  },
  defaultFileUploadHeader: {
    id: 'application.system:core.default.fileUpload.header',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: 'Default file upload header',
  },
  defaultFileUploadButtonLabel: {
    id: 'application.system:core.default.fileUpload.buttonLabel',
    defaultMessage: 'Veljið skjöl til að hlaða upp',
    description: 'Default file upload button label',
  },
  defaultBankAccountBankNumber: {
    id: 'application.system:core.default.bankAccount.bankNumber',
    defaultMessage: 'Bankanúmer',
    description: 'Bank account bank number',
  },
  defaultBankAccountLedger: {
    id: 'application.system:core.default.bankAccount.ledger',
    defaultMessage: 'Höfuðbók',
    description: 'Bank account ledger',
  },
  defaultBankAccountAccountNumber: {
    id: 'application.system:core.default.bankAccount.accountNumber',
    defaultMessage: 'Reikningsnúmer',
    description: 'Bank account account number',
  },
  defaultDownloadButtonTitle: {
    id: 'application.system:core.default.pdfLinkButtonField.downloadButtonTitle',
    defaultMessage: 'Hlaða niður skjali',
    description: 'Button label to download file',
  },
  defaultQuantityTitle: {
    id: 'application.system:core.default.pdfLinkButtonField.defaultQuantityTitle',
    defaultMessage: 'Fjöldi',
    description: 'Quantity label for payment overview field',
  },
  defaultUnitPriceTitle: {
    id: 'application.system:core.default.pdfLinkButtonField.defaultUnitPriceTitle',
    defaultMessage: 'Verð',
    description: 'Unit price label for payment overview field',
  },
  defaultTotalPerUnitTitle: {
    id: 'application.system:core.default.pdfLinkButtonField.defaultTotalPerUnitTitle',
    defaultMessage: 'Samtals verð',
    description: 'Total per unit label for payment overview field',
  },
})

export const coreErrorMessages = defineMessages({
  defaultTemplateApiError: {
    id: 'application.system:core.defaultTemplateApiError',
    defaultMessage: 'Villa kom upp',
    description: 'Unkonwn template api error',
  },
  defaultError: {
    id: 'application.system:core.default.error',
    defaultMessage: 'Ógilt gildi',
    description: 'Generic invalid value error message',
  },
  errorDataProvider: {
    id: 'application.system:core.error.dataProvider',
    defaultMessage: 'Úps! Eitthvað fór úrskeiðis við að sækja gögnin þín',
    description: 'Oops! Something went wrong when fetching your data',
  },
  errorDataProviderMaritalStatus: {
    id: 'application.system:core.error.dataProviderMaritalStatus',
    defaultMessage:
      'Núverandi hjúskaparstaða þín leyfir þér ekki að halda áfram með þessa umsókn. Vinsamlega hafðu samband við Sýslumanninn í Vestmannaeyjum fyrir nánari upplýsingar.',
    description: 'Oops! Something went wrong when fetching your data',
  },
  errorDataProviderHealthInsuranceCantBeReached: {
    id: 'application.system:core.error.dataProviderHealthInsuranceCantBeReached',
    defaultMessage:
      'Ekki tókst að sækja upplýsingar til Sjúkratrygginga. Vinsamlegast reynið aftur síðar.',
    description: 'Oops! Something went wrong when fetching your data',
  },
  errorDataProviderEstateHeirsWithoutAdvocate: {
    id: 'application.system:core.error.dataProviderEstateHeirsWithoutAdvocate',
    defaultMessage: 'Erfingi undir 18 ára án málsvara',
    description: 'Young estate heirs without advocate error',
  },
  errorDataProviderEstateValidationFailed: {
    id: 'application.system:core.error.dataProviderEstateValidationFailed',
    defaultMessage: 'Gögnum hafnað',
    description:
      'Text that appears when district comissioner has validation fails in pre-data',
  },
  errorDataProviderEstateValidationFailedSummary: {
    id: 'application.system:core.error.dataProviderEstateValidationFailedSummary',
    defaultMessage: 'Svar frá Sýslumanni: {message}',
    description:
      'Text that appears when district comissioner has validation fails in pre-data',
  },
  errorDataProviderEstateValidationNothingFoundSummary: {
    id: 'application.system:core.error.dataProviderEstateValidationNothingFoundSummary',
    defaultMessage:
      'Engin dánarbú fundust. Vinsamlegast hafðu samband við Sýslumenn ef þú telur að um villu sé að ræða.',
    description:
      'Text that appears when district comissioner has no estate data in pre-data',
  },
  fileUpload: {
    id: 'application.system:core.error.file.upload',
    defaultMessage: 'Villa kom upp við að hlaða inn einni eða fleiri skrám.',
    description: 'Error message when upload file fails',
  },
  fileUploadMalware: {
    id: 'application.system:core.error.file.uploadMalware',
    defaultMessage: 'Eftirfarandi skrár hafa verið merktar sýktar: {files}',
    description: 'Error message when upload file has been flagged for malware',
  },
  uploadMultipleNotAllowed: {
    id: 'application.system:core.error.file.uploadMultipleNotAllowed',
    defaultMessage: 'Það má bara hlaða upp einni skrá',
    description: 'Error message when multi upload is not allowed.',
  },
  fileRemove: {
    id: 'application.system:core.error.file.remove',
    defaultMessage: 'Villa kom upp við að fjarlægja skrána.',
    description: 'Error message when deleting a file fails',
  },
  fileMaxSizeLimitExceeded: {
    id: 'application.system:core.error.file.maxSizeLimitExceeded',
    defaultMessage:
      'Skráin er of stór. Hægt er að hlaða inn skrám sem eru {maxSizeInMb}MB eða minni.',
    description: 'Error message when file size exceeds max size limit',
  },
  fileMaxSumSizeLimitExceeded: {
    id: 'application.system:core.error.file.maxSizeLimitSumExceeded',
    defaultMessage:
      'Skrárnar eru samtals of stórar. Hægt er að hlaða inn skrám sem eru samtals {maxSizeInMb}MB eða minni.',
    description: 'Error message when sum of file sizes exceeds max size limit',
  },
  fileMaxCountLimitExceeded: {
    id: 'application.system:core.error.file.maxCountLimitExceeded',
    defaultMessage:
      'Of margar skrár. Mest er hægt að hlaða inn {maxFileCount} skrám.',
    description: 'Error message when file count exceeds max count limit',
  },
  fileInvalidExtension: {
    id: 'application.system:core.error.file.invalidExtension',
    defaultMessage:
      'Skráin er ekki í réttu sniði. Hægt er að hlaða inn skrám með endingunum {accept}.',
    description: 'Error message when file extension is invalid',
  },
  isMissingTokenErrorTitle: {
    id: 'application.system:core.missing.token.error.title',
    defaultMessage: 'Úps! Enginn tóki fannst',
    description: 'Oops! No token found',
  },
  isMissingTokenErrorDescription: {
    id: 'application.system:core.missing.token.error.description',
    defaultMessage: 'Ekki er hægt að tengja umsókn án auðkenningartóka',
    description: 'It is not possible to open an application without a token',
  },
  couldNotAssignApplicationErrorTitle: {
    id: 'application.system:could.not.assign.application.error.title',
    defaultMessage: 'Úps! Ekki tókst að tengjast umsókn',
    description: 'Oops! Could not assign to the application',
  },
  couldNotAssignApplicationErrorDescription: {
    id: 'application.system:could.not.assign.application.error.description',
    defaultMessage:
      'Villa koma upp við að tengjast umsókn og hefur hún verið skráð',
    description:
      'There are errors related to the application and it has been reported',
  },
  missingAnswer: {
    id: 'application.system:missing.answer',
    defaultMessage: 'Svar vantar',
    description: 'Copy when answer is missing',
  },
  failedDataProvider: {
    id: 'application.system:fetch.data.error',
    defaultMessage: 'Villa kom upp við að sækja gögn',
    description: 'Default error when dataprovider fails',
  },
  failedDataProviderSubmit: {
    id: 'application.system:fetch.data.failedDataProviderSubmit',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description:
      'Error message for dataprovider screen when one of the dataproviders fails',
  },
  paymentSubmitFailed: {
    id: 'application.system:core.payment.submitTitle',
    defaultMessage: 'Sending umsóknar mistókst',
    description: 'Message indicating submission after payment failed',
  },
  paymentSubmitFailedDescription: {
    id: 'application.system:core.payment.paymentSubmitFailedDescription',
    defaultMessage:
      'Villa hefur komið upp við áframhaldandi vinnslu. Vinsamlegast reynið aftur síðar. Ef villa endurtekur sig vinsamlegast hafið samband við island@island.is.',
    description: 'Message indicating submission after payment failed',
  },
  applicationSubmitFailed: {
    id: 'application.system:core.application.SubmitFailed',
    defaultMessage: 'Sending umsóknar mistókst',
    description: 'Message indicating submission of application failed',
  },
  paymentSubmitRetryButtonCaption: {
    id: 'application.system:core.payment.retryCaption',
    defaultMessage: 'Reyna aftur',
    description: 'Caption for the retry button',
  },
  paymentStatusError: {
    id: 'application.system:core.payment.statusError',
    defaultMessage: 'Tókst ekki að sækja stöðu greiðslu',
    description: 'Message indicating failure to fetch payment status',
  },
  invalidNationalId: {
    id: 'application.system:core.payment.invalidNationalId',
    defaultMessage: 'Ógild kennitala',
    description: 'Message indicating national id is invalid',
  },
  invalidCompanySelectedTitle: {
    id: 'application.system:core.payment.invalidCompanySelectedTitle',
    defaultMessage: 'Þú mátt ekki velja þetta fyrirtæki',
    description:
      'Title error message when a user selects company on forbidden list',
  },
  invalidCompanySelectedMessage: {
    id: 'application.system:core.payment.invalidCompanySelectedMessage',
    defaultMessage: 'Þetta fyrirtæki er á bannlista, vinsamlegast veldu annað',
    description: 'Error message when a user selects company on forbidden list',
  },
  noCompanySearchResultsFoundTitle: {
    id: 'application.system:core.payment.noCompanySearchResultsFoundTitle',
    defaultMessage: 'Engar niðurstöður fundust hjá fyrirtækjaskrá',
    description: 'Title error message when no company search result is found',
  },
  noCompanySearchResultsFoundMessage: {
    id: 'application.system:core.payment.noCompanySearchResultsFoundMessage',
    defaultMessage: 'Vinsamlegast athugaðu hvort að rétt var slegið inn.',
    description: 'Error Message when no company search result is found',
  },
  nationalRegistryAgeLimitNotMetTitle: {
    id: 'application.system:core.fetch.data.nationalRegistryAgeLimitNotMetTitle',
    defaultMessage: 'Þú hefur ekki náð tilskyldum aldri fyrir þessa umsókn',
    description:
      'Error Title when age restriciton from national registry is not met',
  },
  nationalRegistryAgeLimitNotMetSummary: {
    id: 'application.system:core.fetch.data.nationalRegistryAgeLimitNotMetSummary',
    defaultMessage: 'Þú hefur ekki náð tilskyldum aldri fyrir þessa umsókn ',
    description:
      'Error message when age restriciton from national registry is not met',
  },
  nationalRegistryHasNoChildrenTitle: {
    id: 'application.system:core.fetch.data.nationalRegistryHasNoChildrenTitle',
    defaultMessage: 'Engin börn í þinni forsjá',
    description:
      'Error message title when a user has no children in their custody',
  },
  nationalRegistryHasNoChildrenSummary: {
    id: 'application.system:core.fetch.data.nationalRegistryHasNoChildrenSummary',
    defaultMessage:
      'Samkvæmt gögnum úr Þjóðskrá Ísland eru engin börn skráð í þinni forsjá. Þessi umsókn er aðeins fyrir foreldra með sameiginlega forsjá. Við bendum á að hægt er að senda beiðni um breytt lögheimili barna til Sýslumanna.',
    description:
      'Error message summary when a user has no children in their custody',
  },
  nationalRegistryHasNoJointCustodyTitle: {
    id: 'application.system:core.fetch.data.nationalRegistryHasNoJointCustodyTitle',
    defaultMessage: 'Þú átt engin börn í sameiginlegri forsjá',
    description:
      'Error message title when a user has no children in joint custody',
  },
  nationalRegistryHasNoJointCustodySummary: {
    id: 'application.system:core.fetch.data.nationalRegistryHasNoJointCustodySummary',
    defaultMessage:
      'Uppfletting í gögnum hjá Þjóðskrá Íslands skilaði eingöngu börnum sem eru alfarið í þinni forsjá.\n\nÞessi umsókn er ætluð foreldrum sem fara sameiginlega með forsjá barna sinna.',
    description:
      'Error message summary when a user has no children in joint custody',
  },
  nationalRegistryAlreadyIcelandicCitizenTitle: {
    id: 'application.system:core.fetch.data.nationalRegistryAlreadyIcelandicCitizenTitle',
    defaultMessage: 'Nú þegar með íslenskt ríkisfang',
    description:
      'Error message title when a user already has icelandic citizenship',
  },
  nationalRegistryAlreadyIcelandicCitizenSummary: {
    id: 'application.system:core.fetch.data.nationalRegistryAlreadyIcelandicCitizenSummary',
    defaultMessage:
      'Samkvæmt gögnum úr Þjóðskrá Ísland er innskráður notandi nú þegar með íslenskt ríkisfang.',
    description:
      'Error message summary when a user already has icelandic citizenship',
  },
  drivingLicenseDuplicateEntryValidationErrorTitle: {
    id: 'application.system:core.fetch.data.drivingLicenseDuplicateEntryValidationError',
    defaultMessage: 'Ökuskírteini hæfir ekki umsókn um samrit',
    description: 'Driving License duplicate entry validation error',
  },
  drivingLicenseDuplicateEntryValidationSign400Error: {
    id: 'application.system:core.fetch.data.drivingLicenseDuplicateEntryValidationSign400Error',
    defaultMessage: 'Ógild tákntala, 400, fannst á ökuskírteini',
    description:
      'Driving License duplicate entry validation error for sign (is: tákntala)',
  },
  drivingLicenseDuplicateEntryValidationExpiredCategoryLicenseError: {
    id: 'application.system:core.fetch.data.drivingLicenseDuplicateEntryValidationExpiredLicenseError',
    defaultMessage:
      'Flokkur "{categoryName}" á ökukírteini er útrunninn eða rennur út innan 6 mánaða',
    description: 'Driving License duplicate entry validation error',
  },
  drivingLicenseNoTeachingRightsTitle: {
    id: 'application.system:core.fetch.data.drivingLicenseNoTeachingRightsTitle',
    defaultMessage: 'Þú hefur ekki ökukennararéttindi í ökuskírteinaskrá.',
    description: 'Driving License provider no teaching rights error',
  },
  drivingLicenseNoTeachingRightsSummary: {
    id: 'application.system:core.fetch.data.drivingLicenseNoTeachingRightsSummary',
    defaultMessage:
      'Vinsamlega hafðu samband við næsta sýslumannsembætti ef þú telur um villu vera að ræða.',
    description: 'Driving License provider no teaching rights error',
  },
  drivingLicenseNotEmployeeTitle: {
    id: 'application.system:core.fetch.data.drivingLicenseNotEmployeeTitle',
    defaultMessage: 'Ekki fannst staðfesting á skráningarréttindum',
    description: 'Driving License provider no teaching rights error',
  },
  drivingLicenseNotEmployeeSummary: {
    id: 'application.system:core.fetch.data.drivingLicenseNotEmployeeSummary',
    defaultMessage:
      'Vinsamlega hafðu samband við Samgöngustofu til að athuga hvort þú hafir sannarlega réttindi til skráningar ökuskóla',
    description: 'Driving License provider no teaching rights error',
  },
  vehiclesEmptyListOwner: {
    id: 'application.system:core.fetch.data.vehiclesEmptyListOwner',
    defaultMessage: 'Þú átt engin ökutæki þar sem þú ert aðaleigandi',
    description: 'You do not have any vehicles where you are the main owner',
  },
  vehiclesEmptyListOwnerOrCoOwner: {
    id: 'application.system:core.fetch.data.vehiclesEmptyListOwnerOrCoOwner',
    defaultMessage:
      'Þú átt engin ökutæki þar sem þú ert aðaleigandi eða meðeigandi',
    description: 'You do not have any vehicles where you are the main owner',
  },
  vehiclesEmptyListDefault: {
    id: 'application.system:core.fetch.data.vehiclesEmptyListDefault',
    defaultMessage: 'Ekki fundust nein ökutæki',
    description: 'Did not find any vehicles',
  },
  drivingLicenseMissingValidCategory: {
    id: 'application.system:core.fetch.data.drivingLicenseMissingValidCategory',
    defaultMessage:
      'Þú ert ekki með nauðsynleg ökuréttindi til að sækja um þessa umsókn',
    description:
      'You do not have enough driving permission to apply for this application',
  },
  nationalRegistryLegalDomicileNotIceland: {
    id: 'application.system:core.fetch.data.nationalRegistryLegalDomicileNotIceland',
    defaultMessage: 'Þú ert ekki með lögheimili á Íslandi',
    description: 'You do not have a domicile in Iceland',
  },
  nationalRegistryCitizenshipNotIcelandic: {
    id: 'application.system:core.fetch.data.nationalRegistryCitizenshipNotIcelandic',
    defaultMessage: 'Þú ert ekki með íslenskt ríkisfang',
    description: 'You do not have a domicile in Iceland',
  },
  nationalRegistryCitizenshipNotWithinEES: {
    id: 'application.system:core.fetch.data.nationalRegistryCitizenshipNotWithinEES',
    defaultMessage: 'Þú ert ekki með ríkisfang innan EES',
    description: 'You do not have citizenship with EES',
  },
  nationalRegistryAgeNotValid: {
    id: 'application.system:core.fetch.data.nationalRegistryAgeNotValid',
    defaultMessage: 'Þú hefur ekki náð tilskyldum aldri fyrir þessa umsókn',
    description: 'You are not old enough to apply for this application',
  },
  nationalRegistryAgeNotValidDescription: {
    id: 'application.system:core.fetch.data.nationalRegistryAgeNotValidDescription',
    defaultMessage: 'Þú hefur ekki náð tilskyldum aldri fyrir þessa umsókn',
    description: 'You are not old enough to apply for this application',
  },
  nationalRegistryBirthplaceMissing: {
    id: 'application.system:core.fetch.data.nationalRegistryBirthplaceMissing',
    defaultMessage: 'Náði ekki að sækja fæðingarstað',
    description: 'Not able to fetch birthplace',
  },
  nationalRegistryResidenceHistoryMissing: {
    id: 'application.system:core.fetch.data.nationalRegistryResidenceHistoryMissing',
    defaultMessage: 'Náði ekki að sækja búsetusögu',
    description: 'Not able to fetch residence history',
  },
  nationalRegistryCohabitantsMissing: {
    id: 'application.system:core.fetch.data.nationalRegistryCohabitantsMissing',
    defaultMessage: 'Náði ekki að sækja samíbúa',
    description: 'Not able to fetch cohabitants',
  },
  applicationIsPrunedAndReadOnly: {
    id: 'application.system:core.fetch.data.applicationIsPrunedAndReadOnly',
    defaultMessage: 'Umsókn hefur runnið út á tíma og hefur verið gerð óvirk.',
    description: 'Application has been pruned and is not editable',
  },
  nationalIdNotFoundInNationalRegistryTitle: {
    id: 'application.system:core.fetch.data.nationalIdNotFoundInNationalRegistryTitle',
    defaultMessage: 'Ekki tókst að sækja gögn úr Þjóðskrá',
    description: 'Not able to fetch data from national registry title',
  },
  nationalIdNotFoundInNationalRegistrySummary: {
    id: 'application.system:core.fetch.data.nationalIdNotFoundInNationalRegistrySummary',
    defaultMessage:
      'Ekki tókst að sækja gögn úr Þjóðskrá fyrir þessa kennitölu.',
    description: 'Not able to fetch data from national registry description',
  },
  paymentCreateChargeFailedStillInProgressTitle: {
    id: 'application.system:core.fetch.data.paymentCreateChargeFailedStillInProgressTitle',
    defaultMessage: 'Greiðsla ennþá í vinnslu',
    description: 'Not able to create payment title',
  },
  paymentCreateChargeFailedStillInProgressSummary: {
    id: 'application.system:core.fetch.data.paymentCreateChargeFailedStillInProgressSummary',
    defaultMessage: 'Greiðsla er enn í vinnslu. Vinsamlega reynið aftur síðar.',
    description: 'Not able to create payment description',
  },
  copyLinkErrorToast: {
    id: 'application.system:copyLink.copyLinkErrorToast',
    defaultMessage: 'Tókst ekki að afrita hlekk',
    description: 'Copy link error toast',
  },
  electricVehicleListEmptyOwner: {
    id: 'application.system:core.fetch.data.electricVehicleListEmptyOwner',
    defaultMessage:
      'Þú átt engan rafbíl þar sem þú ert aðaleigandi og uppfyllir umsóknarskilyrði',
    description:
      'You do not have any electric vehicles where you are the main owner',
  },
  vehicleNotOwner: {
    id: 'application.system:core.fetch.data.vehicleNotOwner',
    defaultMessage: 'Þú ert ekki aðaleigandi á þessu ökutæki',
    description: 'You are not the main owner of this vehicle',
  },
  noBankAccountError: {
    id: 'application.system:core.fetch.data.noBankAccountError',
    defaultMessage: 'Bankareikningur ekki skráður',
    description: 'No bank account error',
  },
  noBankAccountErrorDescription: {
    id: 'application.system:core.fetch.data.noBankAccountErrorDescription#markdown',
    defaultMessage:
      'Þú ert ekki með skráðan bankareikning hjá Ísland.is. Vinsamlegast skráðu það [hér]({link})',
    description: 'No bank account error',
  },
  invalidBankAccountError: {
    id: 'application.system:core.fetch.data.invalidBankAccountError',
    defaultMessage: 'Ógildur bankareikningur skráður',
    description: 'Invalid bank account registered',
  },
  invalidEmailOrPhone: {
    id: 'application.system:core.fetch.data.invalidEmailOrPhone',
    defaultMessage: 'Ekkert netfang né símanúmer skráð',
    description: 'No email address or phone number registered',
  },
  invalidEmailOrPhoneDescription: {
    id: 'application.system:core.fetch.data.noEmailError.invalidEmailOrPhoneDescription#markdown',
    defaultMessage:
      'Þú ert hvorki með skráð netfang né símanúmer hjá Ísland.is. Vinsamlegast skráðu það [hér]({link}).',
    description:
      'You neither have a registered email address nor phone number at Ísland.is. Please register an email address and phone number here .',
  },
  noEmailFound: {
    id: 'application.system:core.fetch.data.noEmailError',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'No email address registered',
  },
  noEmailFoundDescription: {
    id: 'application.system:core.fetch.data.noEmailError.description#markdown',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Ísland.is. Vinsamlegast skráðu það [hér]({link}).',
    description:
      'You do not have a registered email address at Ísland.is. Please register an email address here .',
  },
  invalidPhone: {
    id: 'application.system:core.fetch.data.invalidPhone',
    defaultMessage: 'Ekkert símanúmer skráð',
    description: 'Invalid phone number',
  },
  invalidPhoneDescription: {
    id: 'application.system:core.fetch.data.invalidPhoneDescription#markdown',
    defaultMessage:
      'Þú ert ekki með skráð símanúmer hjá Ísland.is. Vinsamlegast skráðu það á [hér]({link}).',
    description:
      'You not have a registered phone number at Ísland.is. Please register a phone number here .',
  },
  machinesEmptyListDefault: {
    id: 'application.system:core.fetch.data.machinesEmptyListDefault',
    defaultMessage: 'Ekki fundust nein tæki',
    description: 'Did not find any machines',
  },
  cantConnectToVer: {
    id: 'application.system:core.fetch.data.cantConnectToVer',
    defaultMessage: 'Ekki tókst að senda inn umsókn til Vinnueftirlitsins',
    description: 'Cant connect to Vinnueftirlit',
  },
  licensesEmptyListDefault: {
    id: 'application.system:core.fetch.data.licensesEmptyListDefault',
    defaultMessage: 'Ekki fundust nein réttindi',
    description: 'Did not find any licenses',
  },
  nationalRegistryName: {
    id: 'application.system:core.fetch.data.nationalRegistryName',
    defaultMessage: 'Nafn',
    description: 'Name',
  },
  nationalRegistryNationalId: {
    id: 'application.system:core.fetch.data.nationalRegistryNationalId',
    defaultMessage: 'Kennitala',
    description: 'National ID',
  },
  nationalRegistryPhone: {
    id: 'application.system:core.fetch.data.nationalRegistryPhone',
    defaultMessage: 'Símanúmer',
    description: 'Phone number',
  },
  nationalRegistryEmail: {
    id: 'application.system:core.fetch.data.nationalRegistryEmail',
    defaultMessage: 'Netfang',
    description: 'Email',
  },
  nationalRegistryNameNotFoundForNationalId: {
    id: 'application.system:core.fetch.data.nationalRegistryNameNotFoundForNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  nationalRegistryMinAgeNotFulfilled: {
    id: 'application.system:core.fetch.data.nationalRegistryMinAgeNotFulfilled',
    defaultMessage: 'Lágmarksaldur er {minAge} ára',
    description: 'Min age not fulfilled error',
  },
  idCardApplicationRequirementsNotMet: {
    id: 'application.system:core.fetch.data.idCardApplicationRequirementsNotMet',
    defaultMessage: 'Þú uppfyllir ekki skilyrði fyrir umsókn um nafnskírteini',
    description: 'Requirements for id card application not met',
  },
  drivingLicenseBookActiveBookNotFound: {
    id: 'application.system:core.fetch.data.drivingLicenseBookActiveBookNotFound',
    defaultMessage: 'Ekki fannst virk ökunámsbók',
    description: 'Did not find active student book',
  },
  vehicleNotFoundForPermno: {
    id: 'application.system:core.fetch.data.vehicleNotFoundForPermno',
    defaultMessage: 'Tókst ekki að sækja ökutæki út frá þessu bílnúmeri.',
    description:
      'Error message if there was no vehicle associated with given permno',
  },
  noContractFoundTitle: {
    id: 'application.system:core.fetch.data.noContractFoundTitle',
    defaultMessage: 'Engir samningar fundust',
    description: 'No contract found title',
  },
  noContractFoundSummary: {
    id: 'application.system:core.fetch.data.noContractFoundSummary',
    defaultMessage:
      'Engir gildir samningar fundust skráðir fyrir þessa kennitölu.',
    description: 'No contract found summary',
  },
  noPropertiesFoundTitle: {
    id: 'application.system:core.fetch.data.noPropertiesFoundTitle',
    defaultMessage: 'Engar eignir fundust',
    description: 'No properties found title',
  },
  noPropertiesFoundSummary: {
    id: 'application.system:core.fetch.data.noPropertiesFoundSummary',
    defaultMessage: 'Engar eignir fundust skráðar fyrir þessa kennitölu.',
    description: 'No properties found summary',
  },
  needToFinishRegistration: {
    id: 'application.system:core.fetch.data.needToFinishRegistration',
    defaultMessage: 'Vantar að klára skráningu',
    description: 'Need to finish registration to continue',
  },
})

export const coreDelegationsMessages = defineMessages({
  delegationPersons: {
    id: 'application.system:core.delegations.delegationPersons',
    defaultMessage: 'Einstaklingar',
    description: 'Delegations person in choose user',
  },
  delegationCompanies: {
    id: 'application.system:core.delegations.delegationCompanies',
    defaultMessage: 'Fyrirtæki',
    description: 'Delegations company in choose user',
  },
  procurationHolder: {
    id: 'application.system:core.delegations.procurationHolder',
    defaultMessage: 'Prókúra',
    description: 'Delegations procurationHolder',
  },
  personalRepresentative: {
    id: 'application.system:core.delegations.personalRepresentative',
    defaultMessage: 'Umboð',
    description: 'Delegations personalRepresentative',
  },
  legalGuardian: {
    id: 'application.system:core.delegations.legalGuardian',
    defaultMessage: 'Forsjá',
    description: 'Delegations legalGuardian',
  },
  custom: {
    id: 'application.system:core.delegations.custom',
    defaultMessage: 'Annað umboð',
    description: 'Delegations custom',
  },
  delegationScreenTitle: {
    id: 'application.system:core.delegations.delegationScreenTitle',
    defaultMessage: 'Umsóknaraðili',
    description: 'Delegations screen title',
  },
  delegationScreenSubtitle: {
    id: 'application.system:core.delegations.delegationScreenSubtitle',
    defaultMessage:
      'Hér getur þú valið fyrir hvaða einstakling þú vilt hefja umsókn fyrir.',
    description: 'Delegations screen subtitle for new application',
  },
  delegationActionCardText: {
    id: 'application.system:core.delegations.delegationActionCardText',
    defaultMessage: 'Kennitala: ',
    description: 'Delegations Screen Card Text',
  },
  delegationActionCardButton: {
    id: 'application.system:core.delegations.delegationActionCardButton',
    defaultMessage: 'Hefja umsókn',
    description: 'Delegations Screen Card Button/Link',
  },
  delegationScreenTitleForOngoingApplication: {
    id: 'application.system:core.delegations.delegationScreenTitleForOngoingApplication',
    defaultMessage: 'Umsókn',
    description: 'Delegations screen title for ongoing application',
  },
  delegationScreenSubtitleForOngoingApplication: {
    id: 'application.system:core.delegations.delegationScreenSubtitleForOngoingApplication',
    defaultMessage:
      'Hér getur þú haldið áfram umsókn fyrir viðkomandi aðila. Ef þú þarft að breyta umsóknaraðila skaltu hefja nýja umsókn.',
    description: 'Delegations screen subtitle for ongoing application',
  },
  delegationScreenNationalId: {
    id: 'application.system:core.delegations.delegationScreenNationalId',
    defaultMessage: 'Kennitala: ',
    description: 'Delegations screen national Id',
  },
  delegationScreenTitleApplicationNoDelegationSupport: {
    id: 'application.system:core.delegations.delegationScreenTitleApplicationNoDelegationSupport',
    defaultMessage: 'Umsókn styður ekki umboð',
    description:
      'Delegations error application does not support delegations title',
  },
  delegationScreenSubtitleApplicationNoDelegationSupport: {
    id: 'application.system:core.delegations.delegationScreenSubtitleApplicationNoDelegationSupport',
    defaultMessage: 'Vinsamlegast skiptu um notanda til að halda áfram.',
    description:
      'Delegations error application does not support delegations title',
  },
  delegationErrorButton: {
    id: 'application.system:core.delegations.delegationErrorButton',
    defaultMessage: 'Skipta um notanda',
    description: 'Delegations Screen Card Button/Link',
  },
})

export const coreErrorScreenMessages = defineMessages({
  notFoundTitle: {
    id: 'application.system:core.errorScreen.notFoundTitle',
    defaultMessage: 'Engin umsóknartegund skilgreind',
    description: 'Error screen title',
  },
  notFoundSubTitle: {
    id: 'application.system:core.errorScreen.notFoundSubTitle',
    defaultMessage:
      'Eftirfarandi ástæður geta verið fyrir því að umsóknin fannst ekki',
    description: 'Error screen subtitle',
  },
  notFoundDescription: {
    id: 'application.system:core.errorScreen.notFoundDescription#markdown',
    defaultMessage: `* Umsóknartegund hefur ekki verið skilgreind\n`,
    description: 'Error screen description',
  },
  forbiddenTitle: {
    id: 'application.system:core.errorScreen.forbiddenTitle',
    defaultMessage: 'Þú hefur ekki aðgang að viðkomandi umsókn',
    description: 'Error screen title',
  },
  forbiddenSubTitle: {
    id: 'application.system:core.errorScreen.forbiddenSubTitle',
    defaultMessage:
      'Eftirfarandi ástæður geta verið fyrir því að umsóknin fannst ekki',
    description: 'Error screen subtitle',
  },
  forbiddenDescription: {
    id: 'application.system:core.errorScreen.forbiddenDescription#markdown',
    defaultMessage: `* Þú ert ekki með aðgang að umsókninni\n* Umsóknin er full kláruð`,
    description: 'Error screen description',
  },
  notExistTitle: {
    id: 'application.system:core.errorScreen.notExistTitle',
    defaultMessage: 'Umsóknartegund ekki til',
    description: 'Error screen title',
  },
  notExistSubTitle: {
    id: 'application.system:core.errorScreen.notExistSubTitle',
    defaultMessage:
      'Eftirfarandi ástæður geta verið fyrir því að umsóknin fannst ekki',
    description: 'Error screen subtitle',
  },
  notExistDescription: {
    id: 'application.system:core.errorScreen.notExistDescription#markdown',
    defaultMessage: `* Það gæti verið stafsetningarvilla í umsóknarnafni\n* Umsóknin gæti verið óaðgengileg\n* Umsóknartegund gæti hafa verið eytt\n* Umsóknartegund gæti verið ógild`,
  },
  applicationIdNotOwnedByUserTitle: {
    id: 'application.system:core.errorScreen.applicationIdNotOwnedByUserTitle',
    defaultMessage: 'Tiltekin umsókn fannst ekki',
    description:
      'Error screen title when application template exists but the specified application cant be found',
  },
  applicationIdNotOwnedByUserSubTitle: {
    id: 'application.system:core.errorScreen.applicationIdNotOwnedByUserSubTitle',
    defaultMessage:
      'Eftirfarandi ástæður geta verið fyrir því að umsóknin fannst ekki',
    description:
      'Error screen subtitle when application template exists but the specified application cant be found',
  },
  applicationIdNotOwnedByUserDescription: {
    id: 'application.system:core.errorScreen.applicationIdNotOwnedByUserDescription#markdown',
    defaultMessage: `* Þú ert ekki með aðgang að umsókninni\n* Umsóknin gæti verið eytt\n* Umsóknin er í eigu annars notanda`,
    description:
      'Error screen description when application template exists but the specified application cant be found',
  },
  badSubjectTitle: {
    id: 'application.system:core.errorScreen.badSubjectTitle',
    defaultMessage: 'Rangt umboð',
    description:
      'Error screen title when user has a bad subject error after checking delegations',
  },
  badSubjectSubTitle: {
    id: 'application.system:core.errorScreen.badSubjectSubTitle',
    defaultMessage:
      'Eftirfarandi ástæður geta verið fyrir því að umsóknin virkar ekki',
    description:
      'Error screen subtitle when user has a bad subject error after checking delegations',
  },
  badSubjectDescription: {
    id: 'application.system:core.errorScreen.badSubjectDescription#markdown',
    defaultMessage: `* Þú hefur ekki rétt umboð til að opna þessa umsóknartegund`,
    description:
      'Error screen description when user has a bad subject error after checking delegations',
  },
  prunedTitle: {
    id: 'application.system:core.errorScreen.prunedTitle',
    defaultMessage: 'Umsóknin er runnin út',
    description:
      'Error screen title when the application has been pruned and is not editable',
  },
  prunedSubTitle: {
    id: 'application.system:core.errorScreen.prunedSubTitle',
    defaultMessage: 'Umsóknin hefur runnið út og er ekki lengur aðgengileg',
    description:
      'Error screen subtitle when the application has been pruned and is not editable',
  },
  prunedDescription: {
    id: 'application.system:core.errorScreen.prunedDescription#markdown',
    defaultMessage: `* Öllum persónugögnum var eytt þegar umsóknin rann út\n* Ef klára á umsókn af þessu tagi þarf að stofna nýja`,
    description:
      'Error screen description when user has a bad subject error after checking delegations',
  },
  lostTitle: {
    id: 'application.system:core.errorScreen.lostTitle',
    defaultMessage: 'Umsókn týnd - Ekki til',
    description: 'Error screen title',
  },
  lostSubTitle: {
    id: 'application.system:core.errorScreen.lostSubTitle',
    defaultMessage:
      'Eftirfarandi ástæður geta verið fyrir því að umsóknin fannst ekki',
    description: 'Error screen subtitle',
  },
  lostDescription: {
    id: 'application.system:core.errorScreen.lostDescription#markdown',
    defaultMessage: `* Umsókn hefur verið fjarlægð\n* Umsókn rann út á tíma\n`,
    description: 'Error screen description',
  },
  buttonNewApplication: {
    id: 'application.system:core.errorScreen.buttonNew',
    defaultMessage: 'Byrja nýja umsókn',
    description: 'Error screen button',
  },
  buttonMyApplications: {
    id: 'application.system:core.errorScreen.buttonMyApplications',
    defaultMessage: 'Fara í þínar umsóknir',
    description: 'Error screen button',
  },
  application: {
    id: 'application.system:core.errorScreen.application',
    defaultMessage: 'Umsókn',
    description: 'Error screen application',
  },
})

export const coreHistoryMessages = defineMessages({
  applicationApproved: {
    id: 'application.system:core.history.applicationApproved',
    defaultMessage: 'Umsókn samþykkt',
    description: 'History application accepted',
  },
  applicationApprovedByReviewer: {
    id: 'application.system:core.history.applicationApprovedByReviewer',
    defaultMessage: 'Samþykkt. [{subject}]',
    description: 'History log approved by reviewer',
  },
  applicationApprovedByReviewerWithActor: {
    id: 'application.system:core.history.applicationApprovedByReviewerWithActor',
    defaultMessage: 'Samþykkt. [{actor} fyrir hönd {subject}]',
    description: 'History log approved by actor on behalf of reviewer',
  },
  applicationApprovedByReviewerFallback: {
    id: 'application.system:core.history.applicationApprovedByReviewerFallback',
    defaultMessage: 'Samþykkt af samþykktaraðila',
    description:
      'History log approved by reviewer, fallback string when nationalId info missing',
  },
  applicationRejectedByReviewer: {
    id: 'application.system:core.history.applicationRejectedByReviewer',
    defaultMessage: 'Hafnað af {subject}',
    description: 'History log Rejected by reviewer',
  },
  applicationRejectedByReviewerWithActor: {
    id: 'application.system:core.history.applicationRejectedByReviewerWithActor',
    defaultMessage: 'Hafnað af {actor} fyrir hönd {subject}',
    description: 'History log Rejected by actor on behalf of reviewer',
  },
  applicationRejectedByReviewerFallback: {
    id: 'application.system:core.history.applicationRejectedByReviewerFallback',
    defaultMessage: 'Hafnað af samþykktaraðila',
    description:
      'History log Rejected by reviewer, fallback string when nationalId info missing',
  },
  applicationRejected: {
    id: 'application.system:core.history.applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'History application rejected',
  },
  applicationSent: {
    id: 'application.system:core.history.applicationSent',
    defaultMessage: 'Umsókn send',
    description: 'History application sent',
  },
  applicationAssigned: {
    id: 'application.system:core.history.applicationAssigned',
    defaultMessage: 'Umsókn úthlutað yfirferðaraðila',
    description: 'History application assigned',
  },
  attachmentsAdded: {
    id: 'application.system:core.history.attachmentsAdded',
    defaultMessage: 'Fylgigögnum bætt við',
    description: 'History attachments added',
  },
  paymentStarted: {
    id: 'application.system:core.history.paymentStarted',
    defaultMessage: 'Greiðsluferli hafið',
    description: 'History payment started',
  },
  paymentCancelled: {
    id: 'application.system:core.history.paymentCancelled',
    defaultMessage: 'Hætt við greiðslu',
    description: 'History payment cancelled',
  },
  paymentAccepted: {
    id: 'application.system:core.history.paymentAccepted',
    defaultMessage: 'Greiðsla móttekin',
    description: 'History payment accepted',
  },
  applicationStarted: {
    id: 'application.system:core.history.applicationStarted',
    defaultMessage: 'Umsókn hafin',
    description: 'History application started',
  },
  applicationAborted: {
    id: 'application.system:core.history.applicationAborted',
    defaultMessage: 'Hætt var við umsókn',
    description: 'History application aborted',
  },
  applicationReceived: {
    id: 'application.system:core.history.applicationReceived',
    defaultMessage: 'Umsókn móttekin',
    description: 'History application received',
  },
})

export const corePendingActionMessages = defineMessages({
  paymentPendingTitle: {
    id: 'application.system:core.pendingAction.paymentPending',
    defaultMessage: 'Bíður Greiðslu',
    description: 'Pending action payment pending',
  },
  paymentPendingDescription: {
    id: 'application.system:core.pendingAction.paymentPendingDescription',
    defaultMessage:
      'Nauðsynlegt er að klára greiðsluferlið til þess að halda áfram',
    description: 'Pending action payment pending description',
  },
  applicationReceivedTitle: {
    id: 'application.system:core.pendingAction.applicationReceived',
    defaultMessage: 'Umsókn móttekin',
    description: 'Pending action application received',
  },
  applicationReceivedDescription: {
    id: 'application.system:core.pendingAction.applicationReceivedDescription',
    defaultMessage: 'Umsókn þín hefur verið móttekin',
    description: 'Pending action application received description',
  },
  waitingForAssigneeTitle: {
    id: 'application.system:core.pendingAction.waitingForAssigniee',
    defaultMessage: 'Skráning yfirferðaraðila',
    description: 'Pending action waiting for assigniee',
  },
  waitingForAssigneeDescription: {
    id: 'application.system:core.pendingAction.waitingForAssignieeDescription',
    defaultMessage: 'Umsóknin þín er í bið eftir úthlutun á yfirferðaraðila',
    description: 'Pending action waiting for assigniee description',
  },
  waitingForReviewTitle: {
    id: 'application.system:core.pendingAction.waitingForReview',
    defaultMessage: 'Bíður eftir yfirferð',
    description: 'Pending action waiting for review',
  },
  waitingForReviewDescription: {
    id: 'application.system:core.pendingAction.waitingForReviewDescription',
    defaultMessage: 'Umsóknin þín er í bið eftir yfirferð',
    description: 'Pending action waiting for review description',
  },
  youNeedToReviewDescription: {
    id: 'application.system:core.pendingAction.youNeedToReviewDescription',
    defaultMessage: 'Beðið er eftir þínu samþykki á þessa umsókn',
    description: 'Pending action you need to review description',
  },
  whoNeedsToReviewDescription: {
    id: 'application.system:core.pendingAction.whoNeedsToReviewDescription',
    defaultMessage: 'Beðið er eftir samþykki frá eftirfarandi aðilum: {value}',
    description: 'Pending action list up who needs to review description',
  },
})
