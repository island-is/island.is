import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { EndorsementListControllerFindByTagsTagsEnum } from '../../../gen/fetch/apis/EndorsementListApi'

registerEnumType(EndorsementListControllerFindByTagsTagsEnum, {
  name: 'EndorsementListControllerFindByTagsTagsEnum',
})

@InputType()
export class FindEndorsementListByTagsDto {
  @Field(() => [EndorsementListControllerFindByTagsTagsEnum])
  @IsEnum(EndorsementListControllerFindByTagsTagsEnum, { each: true })
  tags!: EndorsementListControllerFindByTagsTagsEnum[]
}
