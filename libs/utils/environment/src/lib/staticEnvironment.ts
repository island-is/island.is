declare global {
  interface Window {
    ENV?: any
  }
}

export const ENV_PREFIX = 'SI_PUBLIC_'

export const getStaticEnv = (environmentVariableName: string) => {
  if (!environmentVariableName.startsWith(ENV_PREFIX)) {
    throw new Error(`Variable must be prefixed with ${ENV_PREFIX}`)
  }
  return window.ENV && window.ENV[environmentVariableName]
}
