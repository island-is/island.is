import { getRequest } from '@island.is/auth-nest-tools'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// Old iOS app user agents:
// - IslandApp/144 CFNetwork/1498.700.2 Darwin/23.6.0

// Old Android app user agents. We associate it with IslandIsApp, assuming
// there are no other React Native android apps calling our API.
// - okhttp/4.9.2

// New app user agents
// - IslandIsApp (1.0.0}) Build/321 (ios/9.0.0)
// - IslandIsApp (1.0.0}) Build/321 (android/9.0.0)

export interface UserAgent {
  ua: string
  os: {
    name?: 'iOS' | 'Android'
    version?: string
  }
  app: {
    name?: 'IslandIsApp'
    version?: string
    build?: number
  }
}

/**
 * Parses the user agent string and returns an object with the user agent, os and app information.
 *
 * Only supports parsing IslandIsApp user agents to start with but the interface is
 * future compatible if we want to parse more user agents with ua-parser-js.
 */
export const parseUserAgent = (userAgentString: string): UserAgent => {
  const userAgent: UserAgent = {
    ua: userAgentString,
    os: {},
    app: {},
  }

  // Match new app user agents
  const newAppRegex =
    /IslandIsApp \(([^)]+)\) Build\/(\d+) \((ios|android)\/([^)]+)\)/
  const newAppMatch = userAgentString.match(newAppRegex)

  if (newAppMatch) {
    userAgent.app.name = 'IslandIsApp'
    userAgent.app.version = newAppMatch[1]
    userAgent.app.build = parseInt(newAppMatch[2], 10)
    userAgent.os.name = newAppMatch[3] === 'ios' ? 'iOS' : 'Android'
    userAgent.os.version = newAppMatch[4]
    return userAgent
  }

  // Match old iOS app user agents
  const oldIosRegex = /IslandApp\/\d+ CFNetwork\/[^\s]+ Darwin\/[^\s]+/
  const oldIosMatch = userAgentString.match(oldIosRegex)

  if (oldIosMatch) {
    userAgent.app.name = 'IslandIsApp'
    userAgent.os.name = 'iOS'
    return userAgent
  }

  // Match old Android app user agents
  const oldAndroidRegex = /okhttp\/[^\s]+/
  const oldAndroidMatch = userAgentString.match(oldAndroidRegex)

  if (oldAndroidMatch) {
    userAgent.app.name = 'IslandIsApp'
    userAgent.os.name = 'Android'
    return userAgent
  }

  // Default return, if no patterns matched
  return userAgent
}

/**
 * Decorator that parses the user agent string from the request headers and returns an object with the user agent, os
 * and app information.
 *
 * Only supports parsing IslandIsApp user agents for now.
 */
export const ParsedUserAgent = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserAgent => {
    const request = getRequest(context)
    const userAgentString = request.headers['user-agent'] || ''

    return parseUserAgent(userAgentString)
  },
)
