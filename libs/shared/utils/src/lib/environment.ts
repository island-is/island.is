type ActiveEnvironment = 'local' | 'dev' | 'staging' | 'production' | 'unknown'

let activeEnvironment: ActiveEnvironment

const isServer = typeof window === 'undefined'

if (isServer) {
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
} else {
  if (window.location.origin.includes('island.is')) {
    activeEnvironment = 'production'
  } else if (window.location.origin.includes('staging01.devland.is')) {
    activeEnvironment = 'staging'
  } else if (window.location.origin.includes('dev01.devland.is')) {
    activeEnvironment = 'dev'
  } else if (window.location.origin.includes('localhost')) {
    activeEnvironment = 'local'
  } else {
    activeEnvironment = 'unknown'
  }
}

/**
 * This function should be really last resort. We are aiming to remove it altogether.
 * Any decisions based on the environment name should be rather based on feature flags and/or configuration.
 * @deprecated
 * @param environment
 */
export const isRunningOnEnvironment = (environment: ActiveEnvironment) => {
  return environment === activeEnvironment
}
