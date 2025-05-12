import { getValueViaPath } from '@island.is/application/core'
import { EmailTemplateGenerator } from '../../../types'
import { ApplicantsInfo } from './types'
import { filterNonRepresentativesAndMapInfo } from './utils'

export const generateRentalAgreementEmail: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { email },
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

  const tenants = filterNonRepresentativesAndMapInfo(
    getValueViaPath<Array<ApplicantsInfo>>(
      application.answers,
      'tenantInfo.table',
      [],
    ) ?? [],
  )

  const landlords = filterNonRepresentativesAndMapInfo(
    getValueViaPath<Array<ApplicantsInfo>>(
      application.answers,
      'landlordInfo.table',
      [],
    ) ?? [],
  )

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

  const allRecipients = [...landlords, ...tenants]

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
    subject: 'Drög að húsaleigusamningi',
    template: {
      title: 'Drög að húsaleigusamningi',
      body: [
        {
          component: 'Heading',
          context: { copy: 'Drög að húsaleigusamningi', align: 'left' },
        },
        {
          component: 'Copy',
          context: {
            copy:
              `<br/>` +
              `<span>Góðan dag.</span>` +
              `<br/>` +
              `<span>Vinsamlegast lestu yfir leigusamninginn hér að neðan. Ef þú ert með athugasemdir við innihald hans væri best að þú svaraðir þessum tölvupósti með þeim.</span>` +
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
