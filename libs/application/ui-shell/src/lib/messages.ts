import { defineMessages } from 'react-intl'

export const m = defineMessages({
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
      'Fyrirgefðu! eitthvað fór rosalega úrskeiðis og við erum að skoða það',
    description:
      'Sorry! something went terribly wrong and we are looking into it',
  },
  userRoleError: {
    id: 'application.system:user.role.error',
    defaultMessage:
      'Innskráður notandi hefur ekki hlutverk í þessu umsóknarástandi',
    description:
      'Logged in user does not have a role in this application state',
  },
  notFoundTitle: {
    id: 'application.system:not-found',
    defaultMessage: 'Umsókn finnst ekki',
    description: 'Application not found',
  },
  notFoundSubTitle: {
    id: 'application.system:not-found-message',
    defaultMessage: 'Engin umsókn fannst á þessari slóð.',
    description: 'No application was found at this URL.',
  },
  tagsInProgress: {
    id: 'application.system:tags.inProgress',
    defaultMessage: 'Í vinnslu',
    description: 'In progress',
  },
  tagsRequiresAction: {
    id: 'application.system:tags.inProgress',
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
})
