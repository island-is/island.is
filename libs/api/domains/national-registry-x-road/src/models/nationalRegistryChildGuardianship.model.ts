import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryXRoadChildGuardianship {
  @Field(() => ID)
  childNationalId!: string

  @Field(() => [String], { nullable: true })
  legalDomicileParent?: Array<string> | undefined

  @Field(() => [String], { nullable: true })
  residenceParent?: Array<string> | undefined
}
