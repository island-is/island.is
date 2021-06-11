const devConfig = {
  production: false,
  api: {
    url: 'http://localhost:3333',
  },
}

const prodConfig = {
  production: true,
  api: {
    url: '',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
