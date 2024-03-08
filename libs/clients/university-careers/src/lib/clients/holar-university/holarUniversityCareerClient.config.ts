import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const HolarUniversityCareerClientConfig = clientConfigFactory(
  UniversityId.HolarUniversity,
  [],
)
