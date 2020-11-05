export default {
  production: false,
  email: {
    fromEmail: 'olafur@sendiradid.is',
    fromName: 'Olafur',
    replyToEmail: 'olafur@sendiradid.is',
    replyToName: 'Ólafur Björn Magnússon',
    servicePortalBaseUrl: 'http://localhost:4200',
  },
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD,
  },
  emailOptions: {
    useTestAccount: true,
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
}
