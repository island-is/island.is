export default {
  production: false,
  thjodskra: {
    url: 'https://skeyti.advania.is/ords/slrv/registry/v1.0',
    username: 'si_flugfargjold',
    password: process.env.THJODSKRA_PASSWORD,
  },
  airlineApiKeys: {
    icelandair: 'icelandair',
    ernir: 'ernir',
  },
  redis: {
    urls: [
      'localhost:7000',
      'localhost:7001',
      'localhost:7002',
      'localhost:7003',
      'localhost:7004',
      'localhost:7005',
    ],
  },
}
