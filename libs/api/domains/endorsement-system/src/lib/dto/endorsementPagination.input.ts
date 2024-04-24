import { Field, InputType } from '@nestjs/graphql'
import { EndorsementListControllerFindByTagsTagsEnum } from '../../../gen/fetch/apis/EndorsementListApi'
import { IsEnum } from 'class-validator'

@InputType()
export class EndorsementPaginationInput {
  @Field(() => [EndorsementListControllerFindByTagsTagsEnum])
  @IsEnum(EndorsementListControllerFindByTagsTagsEnum, { each: true })
  tags!: EndorsementListControllerFindByTagsTagsEnum[]

  @Field({ nullable: true })
  limit?: number

  @Field({ nullable: true })
  before?: string

  @Field({ nullable: true })
  after?: string
}
