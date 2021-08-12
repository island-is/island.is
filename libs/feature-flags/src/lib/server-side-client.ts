import {
  ServerSideFeatures,
  ServerSideFlagsOnTheClientSide,
} from './server-side'
import { ServerSideFeature } from './types'

export const ServerSideFlagClient: ServerSideFeature =
  typeof window === 'undefined'
    ? new ServerSideFlagsOnTheClientSide()
    : new ServerSideFeatures(process.env.SSF_ON)
