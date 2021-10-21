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
  cardButtonInProgress: {
    id: 'application:card.button.inProgress',
    defaultMessage: 'Opna umsókn',
    description: 'Button label when application is in progress',
  },
  cardButtonComplete: {
    id: 'application:card.button.complete',
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
})

export const coreErrorMessages = defineMessages({
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
  errorDataProviderDescription: {
    id: 'application.system:core.error.dataProvider.description',
    defaultMessage: 'Upp kom óvænt villa. Vinsamlegast reyndu aftur.',
    description: 'An unexpected error occured. Please try again.',
  },
  fileUpload: {
    id: 'application.system:core.error.file.upload',
    defaultMessage: 'Villa kom upp við að hlaða inn einni eða fleiri skrám.',
    description: 'Error message when upload file fails',
  },
  fileRemove: {
    id: 'application.system:core.error.file.remove',
    defaultMessage: 'Villa kom upp við að fjarlægja skrána.',
    description: 'Error message when deleting a file fails',
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
    description: 'Copy when there was an error in one or more data providers',
  },
})
