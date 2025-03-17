import { getValueViaPath } from '@island.is/application/core'
import { EmailTemplateGenerator } from '../../../types'

export const generateRentalAgreementEmail: EmailTemplateGenerator = (props) => {
  const { application } = props

  const applicationCreator = {
    name:
      getValueViaPath(
        application.externalData,
        'nationalRegistry.fullName',
        '',
      ) || '',
    email:
      getValueViaPath(application.externalData, 'userProfile.data.email', '') ||
      '',
  }

  const tenants = (
    getValueViaPath(application.answers, 'tenantInfo.table', []) as Array<{
      nationalIdWithName: { name: string }
      email: string
    }>
  ).map((tenant) => ({
    name: tenant.nationalIdWithName.name,
    address: tenant.email,
  }))

  const landlords = (
    getValueViaPath(application.answers, 'landlordInfo.table', []) as Array<{
      nationalIdWithName: { name: string }
      email: string
    }>
  ).map((landlord) => ({
    name: landlord.nationalIdWithName.name,
    address: landlord.email,
  }))

  const htmlSummaryForEmail = getValueViaPath(
    application.answers,
    'htmlSummary',
  ) as string

  const emailContent = JSON.parse(htmlSummaryForEmail).html
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
      name: applicationCreator.name,
      address: applicationCreator.email,
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
