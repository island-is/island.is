import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { InstitutionType } from '@island.is/judicial-system/types'

registerEnumType(InstitutionType, { name: 'InstitutionType' })

@ObjectType()
export class Institution {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => InstitutionType, { nullable: true })
  readonly type?: InstitutionType

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => Boolean, { nullable: true })
  readonly active?: boolean

  @Field(() => ID, { nullable: true })
  readonly defaultCourtId?: string

  @Field(() => String, { nullable: true })
  readonly policeCaseNumberPrefix?: string

  @Field(() => String, { nullable: true })
  readonly nationalId?: string
}
