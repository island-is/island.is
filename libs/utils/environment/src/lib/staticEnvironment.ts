export const ENV_PREFIX = 'SI_PUBLIC_'

export const getStaticEnv = (environmentVariableName: string) => {
  const environment = JSON.parse(
    document.getElementById('__SI_ENVIRONMENT__')?.textContent || '{}',
  )
  if (!environmentVariableName.startsWith(ENV_PREFIX)) {
    throw new Error(`Variable must be prefixed with ${ENV_PREFIX}`)
  }
  return environment && environment[environmentVariableName]
}
