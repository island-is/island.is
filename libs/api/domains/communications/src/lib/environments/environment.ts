export const environment = {
  emailOptions: {
    useTestAccount: true,
    options: {
      region: process.env.EMAIL_REGION,
    },
    sendFrom: process.env.SEND_FROM_EMAIL,
    contactUsDestination: process.env.CONTACT_US_EMAIL,
    tellUsAStoryDestination: process.env.TELL_US_A_STORY_EMAIL,
  },
  zendeskOptions: {
    email: process.env.ZENDESK_CONTACT_FORM_EMAIL,
    token: process.env.ZENDESK_CONTACT_FORM_TOKEN,
    subdomain: process.env.ZENDESK_CONTACT_FORM_SUBDOMAIN,
  },
}
