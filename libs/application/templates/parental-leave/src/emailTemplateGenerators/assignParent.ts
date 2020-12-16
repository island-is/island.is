import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'
import { Application } from '@island.is/application/core'

export default (application: Application, token: string): SendMailOptions => ({
  // TODO: place strings in translation file
  from: {
    name: 'Fæðingarorlofssjóður',
    address: 'baering@aranja.com',
  },
  replyTo: {
    name: 'Fæðingarorlofssjóður',
    address: 'baering@aranja.com',
  },
  to: [
    {
      name: '',
      address: application.answers.employerEmail as string,
    },
  ],
  subject: ``,
  // TODO: get client origin from environment to replace http://localhost:4200
  text: dedent(`
    Góðan dag.
    
    Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem foreldri í umsókn sinni.
    
    Ef þú áttir von á þessum tölvupósti þá getur þú haldið áfram hingað til þess að fara yfir umsóknina: http://localhost:4200/tengjast-umsokn?token=${token}

    Með kveðju.
    Starfsfólk fæðingarorlofssjóðs
  `),
})
