import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { EndorsementListControllerFindListsTagEnum } from '../../../gen/fetch/apis/EndorsementListApi'

registerEnumType(EndorsementListControllerFindListsTagEnum, {
  name: 'EndorsementListControllerFindListsTagEnum',
})

@InputType()
export class FindEndorsementListByTagDto {
  @Field(() => EndorsementListControllerFindListsTagEnum)
  @IsEnum(EndorsementListControllerFindListsTagEnum)
  tag!: EndorsementListControllerFindListsTagEnum
}
