import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { EndorsementListControllerFindByTagsTagsEnum } from '../../../gen/fetch/apis/EndorsementListApi'

registerEnumType(EndorsementListControllerFindByTagsTagsEnum, {
  name: 'EndorsementListControllerFindByTagsTagsEnum',
})

@InputType()
export class PaginatedEndorsementListInput {
  @Field(() => [EndorsementListControllerFindByTagsTagsEnum])
  @IsEnum(EndorsementListControllerFindByTagsTagsEnum, { each: true })
  tags!: EndorsementListControllerFindByTagsTagsEnum[]

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  before?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  after?: string
}
