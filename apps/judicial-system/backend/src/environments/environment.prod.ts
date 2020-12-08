export default {
  production: true,
  notifications: {
    judgeMobileNumber: process.env.JUDGE_MOBILE_NUMBER,
    prisonEmail: process.env.PRISON_EMAIL,
  },
  email: {
    fromEmail: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME,
    replyToEmail: process.env.EMAIL_REPLY_TO,
    replyToName: process.env.EMAIL_REPLY_TO_NAME,
  },
  smsOptions: {
    url: process.env.NOVA_URL,
    username: process.env.NOVA_USERNAME,
    password: process.env.NOVA_PASSWORD,
  },
  signingOptions: {
    url: process.env.DOKOBIT_URL,
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION,
    },
  },
}
