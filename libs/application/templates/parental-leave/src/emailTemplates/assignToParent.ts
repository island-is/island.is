import { dedent } from 'ts-dedent'
import { SendMailOptions } from 'nodemailer'
import { ApplicationContext } from '@island.is/application/core'

// TODO - correct text and read info from application
export default ({ application }: ApplicationContext): SendMailOptions => ({
  from: {
    name: 'ParentlLeave application',
    address: 'magnea@aranja.com',
  },
  replyTo: {
    name: 'ParentlLeave application',
    address: 'magnea@aranja.com',
  },
  to: [
    {
      name: 'Foo',
      address: 'foo@bar.com',
    },
  ],
  subject: ``,
  text: dedent(`
    Hello parent, ${application.applicant} has assigned you as a reviewer of this application.
    
    Review application (${application.id}), here: link to applicaiton.
  `),
})
