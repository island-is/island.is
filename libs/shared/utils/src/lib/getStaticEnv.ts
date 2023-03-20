export const ENV_PREFIX = 'SI_PUBLIC_'

export const getStaticEnv = (environmentVariableName: string) => {
  const environment: { [name: string]: string } = JSON.parse(
    document.getElementById('__SI_ENVIRONMENT__')?.textContent || '{}',
  )

  if (
    !(
      environmentVariableName.startsWith(ENV_PREFIX) ||
      environmentVariableName === 'APP_VERSION' ||
      environmentVariableName === 'PROD_MODE'
    )
  ) {
    throw new Error(
      `Variable must be prefixed with ${ENV_PREFIX} or be APP_VERSION`,
    )
  }

  return environment && environment[environmentVariableName]
}
