import { Field, ObjectType } from '@nestjs/graphql'
import { IdentityDocument } from './identityDocument.model'
import { IdentityDocumentChild } from './identityDocumentChild.model'

@ObjectType()
export class Passport {
  @Field(() => IdentityDocument, { nullable: true })
  userPassport?: IdentityDocument

  @Field(() => [IdentityDocumentChild], { nullable: true })
  childPassports?: IdentityDocumentChild[]
}
