import { Field, ObjectType } from '@nestjs/graphql'
import { IdentityDocument } from './identityDocument.model'

@ObjectType()
export class IdentityDocumentChild {
  @Field({ nullable: true })
  nationalId?: string

  @Field(() => [String], { nullable: true })
  secondParent?: string[]

  @Field(() => [IdentityDocument], { nullable: true })
  identityDocuments?: IdentityDocument[]
}
