import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryChildGuardianship {
  @Field(() => ID)
  childNationalId!: string

  @Field(() => [String], { nullable: true })
  legalDomicileParent?: Array<string> | undefined

  @Field(() => [String], { nullable: true })
  residenceParent?: Array<string> | undefined
}
