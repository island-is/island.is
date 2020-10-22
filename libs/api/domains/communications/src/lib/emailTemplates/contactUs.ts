import dedent from 'dedent'
import { SendMailOptions } from 'nodemailer'
import { ContactUsInput } from '../dto/contactUs.input'

export const getTemplate = (input: ContactUsInput): SendMailOptions => ({
  from: {
    name: 'Island.is communications',
    address: 'island@island.is',
  },
  to: [
    {
      name: 'Island.is þjónustuborð',
      address: 'island@island.is',
    },
  ],
  subject: `Contact us: ${input.name}`,
  text: dedent(`
    Contact us:
    Subject: ${input.subject}
    Message: ${input.message}
    
    Name: ${input.name}
    Email: ${input.email}
    Phone: ${input.phone}
  `),
})
