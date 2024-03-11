import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const UniversityOfIcelandCareerClientConfig = clientConfigFactory(
  UniversityId.UniversityOfIceland,
  ['@hi.is/brautskraningar'],
  'IS-DEV/EDU/10056/LBHI-Protected/brautskraning-v1',
)
