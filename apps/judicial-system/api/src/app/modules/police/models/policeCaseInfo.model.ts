import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IndictmentSubtype } from '@island.is/judicial-system/types'

@ObjectType()
export class PoliceCaseInfo {
  @Field(() => ID)
  readonly policeCaseNumber!: string

  @Field(() => String, { nullable: true })
  readonly place?: string

  @Field(() => String, { nullable: true })
  readonly date?: string

  @Field(() => String, { nullable: true })
  readonly licencePlate?: string

  @Field(() => [IndictmentSubtype], { nullable: true })
  readonly subtypes?: IndictmentSubtype[]
}
