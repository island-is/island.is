import { ClientConfigFactory } from '../../configFactory'

export const OrganDonationClientConfig = ClientConfigFactory(
  'ORGAN_DONATION',
  [], // TODO: Correct scope
  'HEALTH_DIRECTORATE',
  'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
)
