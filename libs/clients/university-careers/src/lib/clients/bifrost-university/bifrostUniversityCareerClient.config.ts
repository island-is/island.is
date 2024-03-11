import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const BifrostUniversityCareerClientConfig = clientConfigFactory(
  UniversityId.BifrostUniversity,
  [],
  'IS-DEV/EDU/10057/Bifrost-Protected/brautskraning-v1',
)
