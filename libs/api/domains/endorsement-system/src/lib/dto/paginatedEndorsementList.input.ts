import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsString } from 'class-validator'
import { EndorsementListControllerFindByTagsTagsEnum } from '../../../gen/fetch/apis/EndorsementListApi'


registerEnumType(EndorsementListControllerFindByTagsTagsEnum, {
  name: 'EndorsementListControllerFindByTagsTagsEnum',
})

@InputType()
export class PaginatedEndorsementListInput {
  @Field(() => [EndorsementListControllerFindByTagsTagsEnum])
  @IsEnum(EndorsementListControllerFindByTagsTagsEnum, { each: true })
  tags!: EndorsementListControllerFindByTagsTagsEnum[]

  @Field()
  @IsNumber()
  limit?: number

  @Field()
  @IsString()
  before?: string

  @Field()
  @IsString()
  after?: string
}
