import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { SectionDtoSectionTypeEnum } from "@island.is/clients/form-system";
import { LanguageTypeInput } from "./languageType.input";
import { ScreenInput } from "./screen.input";

registerEnumType(SectionDtoSectionTypeEnum, {
  name: 'FormSystemSectionDtoSectionTypeEnum'
})

@InputType('FormSystemSectionInput')
export class SectionInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => SectionDtoSectionTypeEnum, { nullable: true })
  sectionType?: SectionDtoSectionTypeEnum

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  waitingText?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => [ScreenInput], { nullable: true })
  screens?: ScreenInput[]
}
