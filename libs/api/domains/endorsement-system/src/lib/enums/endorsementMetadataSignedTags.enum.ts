import { registerEnumType } from '@nestjs/graphql'
import { EndorsementMetadataSignedTagsEnum } from '../../../gen/fetch' // this is red and unused ? ...................

registerEnumType(EndorsementMetadataSignedTagsEnum, {
  name: 'EndorsementMetadataSignedTagsEnum',
})

export { EndorsementMetadataSignedTagsEnum }
