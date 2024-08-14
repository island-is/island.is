import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model";
import { ApplicationScreenInput } from "./applicationScreen.input";
import { ApplicationSectionDtoSectionTypeEnum } from "@island.is/clients/form-system";

registerEnumType(ApplicationSectionDtoSectionTypeEnum, {
  name: 'FormSystemApplicationSectionDtoSectionTypeEnum'
})

@ObjectType('FormSystemApplicationSectionInput')
export class ApplicationSectionInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType;

  @Field(() => ApplicationSectionDtoSectionTypeEnum, { nullable: true })
  sectionType?: ApplicationSectionDtoSectionTypeEnum;

  @Field(() => Int, { nullable: true })
  displayOrder?: number;

  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType;

  @Field(() => [ApplicationScreenInput], { nullable: true })
  screens?: ApplicationScreenInput[];
}
