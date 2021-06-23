import { registerEnumType } from '@nestjs/graphql'
import { EndorsementMetadataSignedTagsEnum } from '../../../gen/fetch'

registerEnumType(EndorsementMetadataSignedTagsEnum, {
  name: 'EndorsementMetadataSignedTagsEnum',
})

export { EndorsementMetadataSignedTagsEnum }
