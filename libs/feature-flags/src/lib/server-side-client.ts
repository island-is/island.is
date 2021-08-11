import { ServerSideFlags, ServerSideFlagsOnTheClientSide } from './server-side'
import { ServerSideFlag } from './types'

export const ServerSideFlagClient: ServerSideFlag =
  typeof window === 'undefined'
    ? new ServerSideFlagsOnTheClientSide()
    : new ServerSideFlags(process.env.SSF_ON)
