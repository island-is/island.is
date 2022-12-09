import { Field, ObjectType } from '@nestjs/graphql'
import { IdentityDocument } from './identityDocument.model'

@ObjectType()
export class IdentityDocumentChild {
  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  secondParent?: string

  @Field({ nullable: true })
  secondParentName?: string

  @Field(() => [IdentityDocument], { nullable: true })
  identityDocuments?: IdentityDocument[]
}
