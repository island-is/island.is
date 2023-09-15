import { Field, ObjectType } from '@nestjs/graphql'
import { IdentityDocumentModel } from './identityDocumentModel.model'
import { IdentityDocumentModelChild } from './identityDocumentModelChild.model'

@ObjectType()
export class Passport {
  @Field(() => IdentityDocumentModel, { nullable: true })
  userPassport?: IdentityDocumentModel

  @Field(() => [IdentityDocumentModelChild], { nullable: true })
  childPassports?: IdentityDocumentModelChild[]
}
