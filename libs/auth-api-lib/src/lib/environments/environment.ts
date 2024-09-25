const config = {
  zendeskOptions: {
    email: process.env.ZENDESK_CONTACT_FORM_EMAIL,
    token: process.env.ZENDESK_CONTACT_FORM_TOKEN,
    subdomain: process.env.ZENDESK_CONTACT_FORM_SUBDOMAIN,
  },
}

export default config
