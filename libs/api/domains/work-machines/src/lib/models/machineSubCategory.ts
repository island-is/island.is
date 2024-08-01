import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class MachineSubCategory {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  parentCategoryName?: string | null

  @Field(() => String, { nullable: true })
  registrationNumberPrefix?: string | null
}
