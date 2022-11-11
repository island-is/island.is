import { EmailSignup } from '@island.is/cms'

export const emailSignup: EmailSignup = {
  // id: '123',
  // title: 'Test',
  // variant: 'test',
  // description: 'Test',
  // inputLabel: 'test',
  // fullNameLabel: 'test',
  // questionLabel: 'test',
  // yesLabel: 'yes',
  // noLabel: 'no',
  // disclaimerLabel: 'disclaimer',
  // buttonText: 'submit',
  // categoryLabel: 'Test',
  // categories: '',
  // signupUrl:
  //   'https://example.com/signup?email={{EMAIL}}&name={{NAME}}&toggle={{TOGGLE}}',

  id: '123',
  title: 'Test',
  description: 'Test',
  signupType: 'mailchimp',
  formFields: [],
  configuration: {
    signupUrl:
      'https://example.com/signup?email={{EMAIL}}&name={{NAME}}&toggle={{TOGGLE}}',
  },
}
