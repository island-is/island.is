import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const UniversityOfAkureyriCareerClientConfig = clientConfigFactory(
  UniversityId.UniversityOfAkureyri,
  ['@hi.is/brautskraningar'],
  'IS-DEV/EDU/10054/UNAK-Protected/brautskraning-v1',
)
