import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const UniversityOfIcelandCareerClientConfig = clientConfigFactory(
  UniversityId.UniversityOfIceland,
  ['@hi.is/brautskraningar'],
  'IS-DEV/EDU/10010/HI-Protected/brautskraning-v1',
)
