import { Field, ID, ObjectType } from '@nestjs/graphql'

import { InstitutionType } from '@island.is/judicial-system/types'
import type { Institution as TInstitution } from '@island.is/judicial-system/types'

@ObjectType()
export class Institution implements TInstitution {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field(() => String)
  readonly type!: InstitutionType

  @Field()
  readonly name!: string
}
