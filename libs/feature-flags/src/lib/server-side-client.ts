import {
  ServerSideFeatures,
  ServerSideFeaturesOnTheClientSide,
} from './server-side'
import { ServerSideFeature } from './types'

export const ServerSideFeatureClient: ServerSideFeature =
  typeof window === 'undefined'
    ? new ServerSideFeaturesOnTheClientSide()
    : new ServerSideFeatures(process.env.SERVERSIDE_FEATURES_ON)
