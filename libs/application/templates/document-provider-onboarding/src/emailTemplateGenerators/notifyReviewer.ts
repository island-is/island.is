import { SendMailOptions } from 'nodemailer'
import { dedent } from 'ts-dedent'
import { Application } from '@island.is/application/core'
import get from 'lodash/get'

export default (
  {
    application,
    clientLocationOrigin,
  }: { application: Application; clientLocationOrigin: string },
  token: string,
): SendMailOptions => {
  // const email = get(application.answers, 'employer.email', null)

  // if (email === null) {
  //   throw new Error('Cannot create email template, missing employer email')
  // }

  // const assignLink = `${clientLocationOrigin}/tengjast-umsokn?token=${token}`

  return {
    // TODO: place strings in translation file
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    replyTo: {
      name: 'Bæring Gunnar Steinþórsson',
      address: 'baering@aranja.com',
    },
    to: [
      {
        name: '',
        address: 'saeunn9@gmail.com',
      },
    ],
    subject: ``,
    text: dedent(`
      Góðan dag.

      Umsækjandi með kennitölu hefur skráð þig sem atvinnuveitanda í umsókn sinni.

      Ef þú áttir von á þessum tölvupósti þá getur þú haldið áfram hingað til þess að fara yfir umsóknina:

      Með kveðju.
      Starfsfólk fæðingarorlofssjóðs
    `),
    html: `
      <p>
        Góðan dag<br/><br/>
        Umsækjandi með kennitöluhefur skráð þig sem <strong>atvinnuveitanda</strong> í umsókn sinni.<br/><br/>
        Ef þú áttir von á þessum tölvupósti þá getur þú <a href="" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.<br/><br/>
        Með kveðju.<br/>
        Starfsfólk fæðingarorlofssjóðs</br>
      </p>
    `,
  }
}
