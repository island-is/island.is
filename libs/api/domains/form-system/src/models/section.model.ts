import { Field, ObjectType, Int } from "@nestjs/graphql";
import { SectionDtoSectionTypeEnum } from "@island.is/clients/form-system";
import { LanguageType } from "./LanguageType.model";
import { Screen as ScreenModel } from './screen.model'

@ObjectType('FormSystemSection')
export class Section {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => SectionDtoSectionTypeEnum, { nullable: true })
  sectionType?: SectionDtoSectionTypeEnum

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => [ScreenModel], { nullable: 'itemsAndList' })
  screens?: ScreenModel[]
}
