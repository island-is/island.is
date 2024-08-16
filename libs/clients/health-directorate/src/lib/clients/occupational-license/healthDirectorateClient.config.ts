import { ClientConfigFactory } from '../../configFactory'

export const HealthDirectorateClientConfig = ClientConfigFactory(
  'OCCUPATIONAL_LICENSE',
  ['@landlaeknir.is/starfsleyfi'],
  'HEALTH_DIRECTORATE',
  'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
)
