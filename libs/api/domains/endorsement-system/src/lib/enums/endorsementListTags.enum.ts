import { registerEnumType } from '@nestjs/graphql'
import { EndorsementListTagsEnum } from '../../../gen/fetch'

registerEnumType(EndorsementListTagsEnum, {
  name: 'EndorsementListTagsEnum',
})

export { EndorsementListTagsEnum }
