import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const HolarUniversityCareerClientConfig = clientConfigFactory(
  UniversityId.HOLAR_UNIVERSITY,
  ['@hi.is/brautskraningar'],
  'IS-DEV/EDU/10055/Holar-Protected/brautskraning-v1',
)
