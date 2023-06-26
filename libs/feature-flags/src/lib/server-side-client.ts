import {
  ServerSideFeatures,
  ServerSideFeaturesOnTheClientSide,
} from './server-side'
import { ServerSideFeatureClientType } from './types'

export const ServerSideFeatureClient: ServerSideFeatureClientType =
  typeof window !== 'undefined'
    ? new ServerSideFeaturesOnTheClientSide()
    : new ServerSideFeatures(process.env.SERVERSIDE_FEATURES_ON)
