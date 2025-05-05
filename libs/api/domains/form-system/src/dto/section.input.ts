import { Field, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'
import { ScreenInput } from './screen.input'

@InputType('FormSystemSectionDisplayOrderInput')
export class SectionDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateSectionsDisplayOrderDtoInput')
export class UpdateSectionsDisplayOrderDtoInput {
  @Field(() => [SectionDisplayOrderInput], { nullable: 'itemsAndList' })
  sectionsDisplayOrderDto?: SectionDisplayOrderInput[]
}

@InputType('FormSystemUpdateSectionsDisplayOrderInput')
export class UpdateSectionsDisplayOrderInput {
  @Field(() => UpdateSectionsDisplayOrderDtoInput, { nullable: true })
  updateSectionsDisplayOrderDto?: UpdateSectionsDisplayOrderDtoInput
}

@InputType('FormSystemUpdateSectionDtoInput')
export class UpdateSectionDtoInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  waitingText?: LanguageTypeInput
}

@InputType('FormSystemUpdateSectionInput')
export class UpdateSectionInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => UpdateSectionDtoInput, { nullable: true })
  updateSectionDto?: UpdateSectionDtoInput
}

@InputType('FormSystemDeleteSectionInput')
export class DeleteSectionInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemCreateSectionDtoInput')
export class CreateSectionDtoInput {
  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemCreateSectionInput')
export class CreateSectionInput {
  @Field(() => CreateSectionDtoInput, { nullable: true })
  createSectionDto?: CreateSectionDtoInput
}

@InputType('FormSystemSectionInput')
export class SectionInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  sectionType?: string

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
