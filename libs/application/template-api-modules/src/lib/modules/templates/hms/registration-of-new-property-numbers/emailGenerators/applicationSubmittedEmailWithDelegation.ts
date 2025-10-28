import { Message } from '@island.is/email-service'
import { formatCurrency, RealEstateAnswers } from '../shared'
import { pathToAsset } from '../utils'
import { getValueViaPath } from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { ApplicationSubmittedEmail } from './shared'

export const generateApplicationSubmittedEmailWithDelegation: ApplicationSubmittedEmail =
  (props, recipient): Message => {
    const {
      application,
      options: { email, clientLocationOrigin },
    } = props
    if (!recipient.email) throw new Error('Recipient email was undefined')

    // Applicant name
    const applicantName = getValueViaPath<string>(
      application.answers,
      'applicant.name',
    )
    const realEstate = getValueViaPath<RealEstateAnswers>(
      application.answers,
      'realEstate.data',
    )
    const selectedRealEstate = getValueViaPath<Array<Fasteign>>(
      application.answers,
      'getProperties.data',
    )?.find(
      (property) => property.fasteignanumer === realEstate?.realEstateName,
    )
    const registrantNationalId = application.applicantActors?.[0]

    const subject = 'Umsókn móttekin!'
    const messageMain =
      `<div style="line-height: 1 !important;">Aðili með kennitölu ${registrantNationalId} hefur sótt um stofnun nýs fasteignanúmers í umboði fyrir Bónus ehf. Upplýsingar úr umsókn:<br/>` +
      `Upplýsingar úr umsókn:<br/></div>`
    const messageContent =
      `<div style="line-height: 1 !important;">Umsækjandi: ${applicantName}<br/>` +
      `Fasteignin: ${selectedRealEstate?.sjalfgefidStadfang?.birting}<br/>` +
      `Fjöldi fasteignanúmera: ${realEstate?.realEstateAmount}<br/>` +
      `Upphæð greiðslu: ${formatCurrency(
        realEstate?.realEstateCost || '',
      )}<br/></div>`

    const goodbyeMessage =
      `<span>Með kveðju,<span><br/>` + `<span>HMS<span><br/>`

    return {
      from: {
        name: email.sender,
        address: email.address,
      },
      to: [{ name: recipient.name, address: recipient.email }],
      subject,
      template: {
        title: subject,
        body: [
          {
            component: 'Image',
            context: {
              src: pathToAsset('logo.jpg'),
              alt: 'Ísland.is logo',
            },
          },
          {
            component: 'Spacer',
          },
          {
            component: 'Image',
            context: {
              src: pathToAsset('Illustration.jpg'),
              alt: 'manneskja fær tilkynningu',
              removeFixedHeight: true,
            },
          },
          {
            component: 'Spacer',
          },
          {
            component: 'Heading',
            context: { copy: subject },
          },
          {
            component: 'Copy',
            context: {
              copy: messageMain,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: messageContent,
            },
          },
          {
            component: 'Button',
            context: {
              copy: 'Skoða umsókn',
              href: `${clientLocationOrigin}/minarsidur/umsoknir/klaradar-umsoknir`,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: goodbyeMessage,
            },
          },
        ],
      },
    }
  }
