import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryV3Citizenship {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String)
  code!: string
}
