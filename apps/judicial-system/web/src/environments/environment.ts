const devConfig = {
  production: false,
  api: {
    url: 'http://localhost:4200',
  },
}

const prodConfig = {
  production: true,
  api: {
    url: '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
