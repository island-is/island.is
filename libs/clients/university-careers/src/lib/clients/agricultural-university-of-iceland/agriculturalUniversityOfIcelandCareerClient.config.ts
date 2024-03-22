import { clientConfigFactory } from '../../configFactory'
import { UniversityId } from '../../universityCareers.types'

export const AgriculturalUniversityOfIcelandCareerClientConfig =
  clientConfigFactory(
    UniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND,
    ['@hi.is/brautskraningar'],
    'IS-DEV/EDU/10056/LBHI-Protected/brautskraning-v1',
  )
