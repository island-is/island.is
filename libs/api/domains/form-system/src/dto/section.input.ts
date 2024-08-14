import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { SectionDtoSectionTypeEnum } from "@island.is/clients/form-system";
import { LanguageType } from "../models/LanguageType.model";

registerEnumType(SectionDtoSectionTypeEnum, {
  name: 'FormSystemSectionDtoSectionTypeEnum'
})

@InputType('FormSystemSectionInput')
export class SectionInput {
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
}
