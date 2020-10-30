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
}
