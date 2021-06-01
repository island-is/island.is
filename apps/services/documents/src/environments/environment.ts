const devConfig = {
  production: false,
  port: 3369,
}

const prodConfig = {
  production: true,
  port: 3333,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
