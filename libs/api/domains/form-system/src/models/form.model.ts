import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";
import { ApplicantType } from "./applicantType.model";
import { Group } from "./group.model";
import { Input } from "./input.model";
import { Step } from "./step.model";
import { Organization } from "./organization.model";
import { DocumentType } from "./documentType.model";


export type Dependencies = {
  [key: string]: string[]
}

@ObjectType('FormSystemForm')
export class Form {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => Organization, { nullable: true })
  organization?: Organization

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  lastChanged?: Date

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date | null

  @Field(() => Object, { nullable: true })
  dependencies?: Dependencies[] | null

  @Field(() => DocumentType, { nullable: true })
  documentTypes?: DocumentType[] | null

  @Field(() => [ApplicantType], { nullable: true })
  formApplicantTypes?: ApplicantType[] | null

  @Field(() => LanguageType, { nullable: true })
  completedMessage?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  isTranslated?: LanguageType

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingStep?: boolean

  @Field(() => Number, { nullable: true })
  applicationsDaysToRemove?: number

  @Field(() => Step, { nullable: true })
  steps?: Step[] | null

  @Field(() => Step, { nullable: true })
  stepsList?: Step[] | null

  @Field(() => Group, { nullable: true })
  groupsList?: Group[] | null

  @Field(() => Input, { nullable: true })
  inputsList?: Input[] | null
}
