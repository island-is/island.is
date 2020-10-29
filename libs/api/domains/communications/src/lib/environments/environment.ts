export const environment = {
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
    contactUsDestination: process.env.CONTACT_US_EMAIL,
    tellUsAStoryDestination: process.env.TELL_US_A_STORY_EMAIL,
  },
}
