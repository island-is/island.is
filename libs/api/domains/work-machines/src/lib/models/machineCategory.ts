import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class MachineCategory {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  subCategoryName?: string | null

  @Field(() => String, { nullable: true })
  registrationNumberPrefix?: string | null
}
