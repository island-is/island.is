import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'
import { Application } from '@island.is/application/core'

export default (
  {
    application,
    clientLocationOrigin,
  }: { application: Application; clientLocationOrigin: string },
  token: string,
): SendMailOptions => {
  const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`

  return {
    // TODO: place strings in translation file
    from: {
      name: 'Fæðingarorlofssjóður',
      address: 'todo@aranja.com',
    },
    replyTo: {
      name: 'Fæðingarorlofssjóður',
      address: 'todo@aranja.com',
    },
    to: [
      {
        name: '',
        address: application.answers.employerEmail as string,
      },
    ],
    subject: ``,
    text: dedent(`
    Góðan dag.
    
    Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem foreldri í umsókn sinni.
    
    Ef þú áttir von á þessum tölvupósti þá getur þú haldið áfram hingað til þess að fara yfir umsóknina: ${assignLink}

    Með kveðju.
    Starfsfólk fæðingarorlofssjóðs
  `),
    html: `
    <p>
      Góðan dag<br/><br/>
      Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem <strong>foreldri</strong> í umsókn sinni.<br/><br/>
      Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.<br/><br/>
      Með kveðju.<br/>
      Starfsfólk fæðingarorlofssjóðs</br>
    </p>
  `,
  }
}
