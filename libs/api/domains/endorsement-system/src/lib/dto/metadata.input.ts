import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { EndorsementMetadataDtoFieldEnum } from '../../../gen/fetch'

registerEnumType(EndorsementMetadataDtoFieldEnum, {
  name: 'EndorsementMetadataDtoFieldEnum',
})

@InputType()
export class MetadataInput {
  @Field(() => EndorsementMetadataDtoFieldEnum)
  @IsEnum(EndorsementMetadataDtoFieldEnum)
  field!: EndorsementMetadataDtoFieldEnum
}
