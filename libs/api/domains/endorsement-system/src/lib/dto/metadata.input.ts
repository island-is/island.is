import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { EndorsementMetadataDtoFieldEnum } from '../../../gen/fetch'

registerEnumType(EndorsementMetadataDtoFieldEnum, {
  name: 'EndorsementMetadataDtoFieldEnum',
})

@InputType()
export class MetadataInput {
  @Field(() => EndorsementMetadataDtoFieldEnum)
  @IsEnum(EndorsementMetadataDtoFieldEnum)
  field!: EndorsementMetadataDtoFieldEnum

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  keepUpToDate!: boolean | null
}
