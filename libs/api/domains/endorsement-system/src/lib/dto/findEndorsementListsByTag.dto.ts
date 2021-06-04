import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { EndorsementListControllerFindByTagTagEnum } from '../../../gen/fetch/apis/EndorsementListApi'

registerEnumType(EndorsementListControllerFindByTagTagEnum, {
  name: 'EndorsementListControllerFindByTagTagEnum',
})

@InputType()
export class FindEndorsementListByTagDto {
  @Field(() => EndorsementListControllerFindByTagTagEnum)
  @IsEnum(EndorsementListControllerFindByTagTagEnum)
  tag!: EndorsementListControllerFindByTagTagEnum
}
