import { Message } from '@island.is/email-service'

export const generateFirearmApplicantEmail: (email: string) => Message = (
  email: string,
) => {
  console.log('email', email)
  return {
    to: email,
    template: {
      title: 'Email title',
      body: [
        {
          component: 'Heading',
          context: {
            copy: 'Email heading',
          },
        },
      ],
    },
  }
}
