import { Field, Int, InputType, ID } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'

@InputType('FormSystemDocumentTypeInput')
export class DocumentTypeInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => ID, { nullable: true })
  guid?: string
}

@InputType('FormSystemDocumentTypeUpdateInput')
export class DocumentTypeUpdateInput {
  @Field(() => Int, { nullable: true })
  formId?: number

  @Field(() => Int, { nullable: true })
  documentTypeId?: number
}
