import type { CyHttpMessages } from 'cypress/types/net-stubbing'
export const cypressError = (msg: string) => {
  throw new Error(msg)
}

export const getCognitoCredentials = () => {
  return {
    cognitoUsername:
      process.env.AWS_COGNITO_USERNAME ||
      cypressError('AWS_COGNITO_USERNAME env variable missing'),
    cognitoPassword:
      process.env.AWS_COGNITO_PASSWORD ||
      cypressError('AWS_COGNITO_PASSWORD env variable missing'),
  }
}

export const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  const { body } = req
  return typeof body === 'object' && body.operationName === operationName
}

export const aliasQuery = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = operationName
  }
}

export const getFakeUser = (fakeUsers: FakeUser[], name: string) =>
  fakeUsers
    .filter((e) => e.name.toLowerCase().includes(name.toLowerCase()))
    .reduce((e) => e)

export const getFamily = (user: FakeUser) => {
  return [
    Object.assign(
      {},
      ...Object.entries(user)
        .filter(([k]) => k !== 'children')
        .map(([k, v]) => ({ [k]: v })),
    ),
    ...(user.children || []),
  ]
}

const getDiscountUser = (fakeUser: FakeUser, discounts: Discount[]) =>
  discounts.filter((e) => e.user.name === fakeUser.name).reduce((e) => e)

export const getDiscountData = (
  fakeUser: FakeUser,
  res: CyHttpMessages.BaseMessage | undefined,
) => {
  const discounts =
    (res?.body.data.discounts as Discount[]) ||
    cypressError('Error getting response data')
  return { discounts, discountUser: getDiscountUser(fakeUser, discounts) }
}

export const getBaseUrl = (
  config: Cypress.ResolvedConfigOptions & Cypress.RuntimeConfigOptions,
): string => config.baseUrl || cypressError('Base url is missing, quitting.')

export const testEnvironment = process.env.TEST_ENVIRONMENT || 'local'
