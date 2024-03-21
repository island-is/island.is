import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const BifrostUniversityCareerClientConfig = clientConfigFactory(
  UniversityId.BifrostUniversity,
  ['@hi.is/brautskraningar'],
  'IS-DEV/EDU/10057/Bifrost-Protected/brautskraning-v1',
)
