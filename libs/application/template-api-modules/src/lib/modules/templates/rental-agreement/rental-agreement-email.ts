import { getValueViaPath } from '@island.is/application/core'
import { applicationAnswers } from '@island.is/application/templates/rental-agreement'
import { EmailTemplateGenerator } from '../../../types'
import { mapApplicantsInfo } from './utils/utils'

export const generateRentalAgreementEmail: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { email, locale },
  } = props

  const applicationCreator = {
    name:
      getValueViaPath<string>(
        application.externalData,
        'nationalRegistry.fullName',
      ) || '',
    email:
      getValueViaPath<string>(
        application.externalData,
        'userProfile.data.email',
      ) || '',
  }

  const { landlords, tenants } = applicationAnswers(application.answers)

  const mappedTenants = mapApplicantsInfo(tenants) ?? []
  const mappedLandlords = mapApplicantsInfo(landlords) ?? []

  const htmlSummaryForEmail = getValueViaPath<string>(
    application.answers,
    'htmlSummary',
    '',
  )

  const emailContent =
    htmlSummaryForEmail && JSON.parse(htmlSummaryForEmail).html
  const emailStyles = `<style type="text/css">
                  #email-summary-container > div {
                    border-bottom: 1px solid #CCDFFF;
                    margin: 20px 0;
                    padding-bottom: 20px;
                  }
                  #email-summary-container > div {
                    border-bottom: 1px solid #CCDFFF;
                    margin: 20px 0;
                    padding-bottom: 6px;
                  }
                  #email-summary-container h3 {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 24px;
                  }

                  #email-summary-container label {
                    font-size: 14px;
                    font-weight: 600;
                  }
                  #email-summary-container label ~ p {
                    margin-bottom: 16px;
                  }
                </style>`

  const allRecipients = [...mappedLandlords, ...mappedTenants]

  const subject =
    locale === 'is' ? 'Drög að húsaleigusamningi' : 'Draft of rental agreement'
  const intro = locale === 'is' ? 'Góðan dag.' : 'Hello.'
  const introText =
    locale === 'is'
      ? 'Vinsamlegast lestu yfir leigusamninginn hér að neðan. Ef þú ert með athugasemdir við innihald hans væri best að þú svaraðir þessum tölvupósti með þeim.'
      : 'Please read the rental agreement below. If you have any comments on its content, it would be best if you replied to this email with them.'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    replyTo: {
      name: applicationCreator.name,
      address: applicationCreator.email,
    },
    to: allRecipients,
    subject: `${subject}`,
    template: {
      title: `${subject}`,
      body: [
        {
          component: 'Heading',
          context: { copy: `${subject}`, align: 'left' },
        },
        {
          component: 'Copy',
          context: {
            copy:
              `<br/>` +
              `<span>${intro}</span>` +
              `<br/>` +
              `<span>${introText}</span>` +
              `<br/><br/>`,
            align: 'left',
            small: true,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `${emailStyles}${emailContent}`,
            align: 'left',
            small: true,
          },
        },
      ],
    },
  }
}
