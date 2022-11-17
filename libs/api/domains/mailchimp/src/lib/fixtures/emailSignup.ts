import { EmailSignup } from '@island.is/cms'

export const emailSignup: EmailSignup = {
  id: '123',
  title: 'Test',
  description: 'Test',
  signupType: 'mailchimp',
  formFields: [
    {
      name: 'EMAIL',
      type: 'email',
      id: '1',
      options: [],
      placeholder: '',
      required: true,
      title: '',
      emailConfig: {},
    },
    {
      name: 'NAME',
      type: 'input',
      id: '2',
      options: [],
      placeholder: '',
      required: true,
      title: '',
      emailConfig: {},
    },
  ],
  configuration: {
    signupUrl: 'https://example.com/signup?{{INPUT_FIELDS}}',
  },
}
