import { InputType, Field } from "@nestjs/graphql";
import { FieldTypeInput } from "./fieldType.input";
import { FormCertificationTypeInput } from "./formCertificationType.input";
import { FormInput } from "./form.input";
import { ListTypeInput } from "./listType.input";


@InputType('FormSystemFormResponseInput')
export class FormResponseInput {
  @Field(() => FormInput, { nullable: true })
  form?: FormInput

  @Field(() => [FieldTypeInput], { nullable: true })
  fieldTypes?: FieldTypeInput[]

  @Field(() => [FormCertificationTypeInput], { nullable: true })
  certificationTypes?: FormCertificationTypeInput[]

  @Field(() => [ListTypeInput], { nullable: true })
  listTypes?: ListTypeInput[]

  @Field(() => [FormInput], { nullable: true })
  forms?: FormInput[]
}
