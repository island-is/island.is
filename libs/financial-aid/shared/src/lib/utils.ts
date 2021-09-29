import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME, months } from './const'
import { User } from './interfaces'

export const getFileType = (fileName: string) => {
  return fileName?.substring(fileName.lastIndexOf('.') + 1)
}

export const getFileSizeInKilo = (file: { size?: number }) => {
  return Math.floor(file.size ? file.size / 1000 : 0)
}

export const currentMonth = () => {
  return months[new Date().getMonth()].toLowerCase()
}

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length <= 10) {
    return insertAt(phoneNumber.replace('-', ''), '-', 3) || '-'
  }

  return insertAt(phoneNumber.replace('-', ''), '-', 4) || '-'
}

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const decodeToken = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(Buffer.from(base64, 'base64').toString('binary'))
}

export const getUserFromContext = (
  context: ExecutionContext & { contextType?: string },
): User | undefined => {
  const req =
    context.contextType === 'graphql'
      ? GqlExecutionContext.create(context).getContext().req
      : context.switchToHttp().getRequest()

  const cookies = req.cookies
  const sessionToken = cookies
    ? cookies[IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME]
    : null

  if (!sessionToken) {
    return undefined
  }

  const decodedToken = decodeToken(sessionToken)

  return {
    name: decodedToken.name,
    nationalId: decodedToken.nationalId,
    folder: decodedToken.folder,
    service: decodedToken.service,
    returnUrl: decodedToken.returnUrl,
  }
}
