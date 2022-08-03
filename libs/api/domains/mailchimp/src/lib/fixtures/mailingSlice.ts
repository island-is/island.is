import { MailingListSignupSlice } from '@island.is/cms'

export const emailSlice: MailingListSignupSlice = {
  id: '123',
  title: 'Test',
  variant: 'test',
  description: 'Test',
  inputLabel: 'test',
  fullNameLabel: 'test',
  questionLabel: 'test',
  yesLabel: 'yes',
  noLabel: 'no',
  disclaimerLabel: 'disclaimer',
  buttonText: 'submit',
  signupUrl:
    'https://example.com/signup?email={{EMAIL}}&name={{NAME}}&toggle={{TOGGLE}}',
}
