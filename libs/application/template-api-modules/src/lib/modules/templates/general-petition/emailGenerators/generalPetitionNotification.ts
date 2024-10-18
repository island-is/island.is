import { getValueViaPath } from '@island.is/application/core'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { SendMailOptions } from 'nodemailer'

type GeneralPetitionNotificationEmail = (
  props: EmailTemplateGeneratorProps,
) => SendMailOptions

export const generalPetitionNotificationEmail: GeneralPetitionNotificationEmail =
  (props) => {
    const {
      application,
      options: {
        email = { sender: 'Ísland.is', address: 'no-reply@island.is' },
      },
    } = props

    const answers = application.answers
    const subject = 'Staðfesting á undirskriftalista'
    const { dateFrom, dateTil } = getValueViaPath(
      application.answers,
      'dates',
    ) as { dateFrom: string; dateTil: string }
    const applicant = application.externalData.nationalRegistry?.data as {
      fullName?: string
    }
    if (!applicant.fullName) {
      throw new Error('Failed to get full name from national registry')
    }

    return {
      from: {
        name: email.sender,
        address: email.address,
      },
      to: [
        {
          name: applicant.fullName as string,
          address: answers.email as string,
        },
      ],
      subject,
      template: {
        title: subject,
        body: [
          {
            component: 'Heading',
            align: 'center',
            context: { copy: `Undirskriftalisti ${answers.listName}` },
          },
          {
            component: 'Copy',
            align: 'center',
            context: {
              copy: `<span>Lýsing: ${answers.aboutList} </span><br/>
                <span>Tímabil lista: ${dateFrom} - ${dateTil} </span><br/>
                <span>Stofnandi lista: ${applicant.fullName} </span><br/>
                <span>Netfang stofnenda: ${answers.email} </span><br/>
                <span>Sími notenda: ${answers.phone} </span><br/><br/>
                <span>Undirskriftarlistar í þinni umsjá er að finna undir Mínar upplýsingar á Mínum síðum á Ísland.is</span><br/><br/>
                <span>Kær kveðja, <br/> Ísland.is</span><br/>`,
            },
          },
        ],
      },
    }
  }
