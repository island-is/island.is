import { Field, ID, InputType } from "@nestjs/graphql"
import { LanguageTypeInput } from "./global.input"



@InputType('FormSystemDocumentTypeInput')
export class DocumentTypeInput {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput
}
