import { ClientConfigFactory } from '../../configFactory'

export const VaccinationsClientConfig = ClientConfigFactory(
  'VACCINATIONS',
  [], // TODO: Add correct scope
  'HEALTH_DIRECTORATE',
  'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
)
