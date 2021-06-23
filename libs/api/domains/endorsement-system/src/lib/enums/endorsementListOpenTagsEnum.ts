import { registerEnumType } from '@nestjs/graphql'
import { EndorsementListOpenTagsEnum } from '../../../gen/fetch'

registerEnumType(EndorsementListOpenTagsEnum, {
  name: 'EndorsementListOpenTagsEnum',
})

export { EndorsementListOpenTagsEnum }
