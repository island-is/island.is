import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const BifrostUniversityCareerClientConfig = clientConfigFactory(
  UniversityId.BifrostUniversity,
  [],
)
