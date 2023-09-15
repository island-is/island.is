export const checksAndValidations = (serviceName: string) => {
  let allErrors: string[] = []
  const checkCollisions = (
    target: { [name: string]: string },
    source: { [name: string]: string },
  ) => {
    const targetKeys = Object.keys(target)
    addToErrors(
      Object.keys(source)
        .filter((srcKey) => targetKeys.includes(srcKey))
        .map(
          (key) =>
            `Collisions in ${serviceName} for environment or secrets for key ${key}`,
        ),
    )
  }
  const mergeObjects = (
    target: { [name: string]: string },
    source: { [name: string]: string },
  ) => {
    checkCollisions(target, source)
    Object.assign(target, source)
  }
  const addToErrors = (errors: string[]) => {
    allErrors.push(...errors)
  }
  const getErrors = () => {
    return [...allErrors]
  }

  return {
    addToErrors,
    mergeObjects,
    checkCollisions,
    getErrors,
  }
}
