const devConfig = {
  production: false,
}

const prodConfig = {
  production: true,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
