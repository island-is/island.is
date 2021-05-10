type ActiveEnvironment = 'local' | 'dev' | 'staging' | 'production' | 'unknown'

let activeEnvironment: ActiveEnvironment

if (process.env.name === 'production') {
  activeEnvironment = 'production'
} else if (process.env.name === 'staging') {
  activeEnvironment = 'staging'
} else if (process.env.name === 'dev') {
  activeEnvironment = 'dev'
} else if (process.env.NODE_ENV === 'development') {
  activeEnvironment = 'local'
} else {
  activeEnvironment = 'unknown'
}

export const isRunningOnEnvironment = (environment: ActiveEnvironment) => {
  return environment === activeEnvironment
}
