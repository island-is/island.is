import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { SectionDtoSectionTypeEnum } from "@island.is/clients/form-system";
import { LanguageTypeInput } from "./languageType.input";
import { ScreenInput } from "./screen.input";

registerEnumType(SectionDtoSectionTypeEnum, {
  name: 'FormSystemSectionDtoSectionTypeEnum'
})

@InputType('FormSystemSectionDisplayOrderInput')
export class SectionDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateSectionInput')
export class UpdateSectionInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  waitingText?: LanguageTypeInput
}

@InputType('FormSystemDeleteSectionInput')
export class DeleteSectionInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateSectionsDisplayOrderInput')
export class UpdateSectionsDisplayOrderInput {
  @Field(() => [SectionDisplayOrderInput], { nullable: 'itemsAndList' })
  sectionsDisplayOrderDto?: SectionDisplayOrderInput[]
}

@InputType('FormSystemCreateSectionInput')
export class CreateSectionInput {
  @Field(() => String, { nullable: true })
  formId?: string
}

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

  @Field(() => [ScreenInput], { nullable: 'itemsAndList' })
  screens?: ScreenInput[]
}
