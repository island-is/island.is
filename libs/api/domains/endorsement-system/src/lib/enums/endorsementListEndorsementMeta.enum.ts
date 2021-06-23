import { registerEnumType } from '@nestjs/graphql'
import { EndorsementListEndorsementMetaEnum } from '../../../gen/fetch'

registerEnumType(EndorsementListEndorsementMetaEnum, {
  name: 'EndorsementListEndorsementMetaEnum',
})

export { EndorsementListEndorsementMetaEnum }
