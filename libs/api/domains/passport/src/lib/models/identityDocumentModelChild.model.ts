import { Field, ObjectType } from '@nestjs/graphql'
import { IdentityDocumentModel } from './identityDocumentModel.model'

@ObjectType()
export class IdentityDocumentModelChild {
  @Field(() => String, { nullable: true })
  childNationalId?: string | null

  @Field(() => String, { nullable: true })
  childName?: string | null

  @Field(() => String, { nullable: true })
  secondParent?: string | null

  @Field(() => String, { nullable: true })
  secondParentName?: string | null

  @Field(() => [IdentityDocumentModel], { nullable: true })
  passports?: IdentityDocumentModel[]
}
