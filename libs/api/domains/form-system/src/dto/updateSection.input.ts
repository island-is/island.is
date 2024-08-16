import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { SectionDtoSectionTypeEnum } from "@island.is/clients/form-system";
import { LanguageTypeInput } from "./languageType.input";
import { ScreenInput } from "./screen.input";

registerEnumType(SectionDtoSectionTypeEnum, {
  name: 'FormSystemSectionDtoSectionTypeEnum'
})

@InputType('FormSystemUpdateSectionInput')
export class UpdateSectionInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  waitingText?: LanguageTypeInput

}
