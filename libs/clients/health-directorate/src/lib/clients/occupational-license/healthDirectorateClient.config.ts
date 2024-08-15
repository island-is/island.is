import { ClientConfigFactory } from '../../configFactory'

export const HealthDirectorateClientConfig = ClientConfigFactory(
  'OCCUPATIONAL_LICENSE',
  ['@island.is/health'],
  'HEALTH_DIRECTORATE',
  'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
)
