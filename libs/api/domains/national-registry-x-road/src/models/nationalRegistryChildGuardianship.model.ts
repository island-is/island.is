import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryChildGuardianship {
  @Field(() => ID)
  nationalId!: string

  @Field(() => [String], { nullable: true })
  legalDomicileParent?: Array<string> | undefined

  @Field(() => [String], { nullable: true })
  residenceParent?: Array<string> | undefined
}
