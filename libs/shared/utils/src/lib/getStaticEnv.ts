export const ENV_PREFIX = 'SI_PUBLIC_'

export const getStaticEnv = (environmentVariableName: string) => {
  const environment = JSON.parse(
    document.getElementById('__SI_ENVIRONMENT__')?.textContent || '{}',
  )

  if (
    !environmentVariableName.startsWith(ENV_PREFIX) ||
    environmentVariableName === 'APP_VERSION'
  ) {
    throw new Error(
      `Variable must be prefixed with ${ENV_PREFIX} or be APP_VERSION`,
    )
  }

  return environment && environment[environmentVariableName]
}
