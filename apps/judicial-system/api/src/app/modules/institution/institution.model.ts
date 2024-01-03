import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { InstitutionType } from '@island.is/judicial-system/types'

registerEnumType(InstitutionType, { name: 'InstitutionType' })

@ObjectType()
export class Institution {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly modified?: string

  @Field(() => InstitutionType, { nullable: true })
  readonly type?: InstitutionType

  @Field({ nullable: true })
  readonly name?: string

  @Field({ nullable: true })
  readonly active?: boolean

  @Field({ nullable: true })
  readonly defaultCourtId?: string

  @Field({ nullable: true })
  readonly policeCaseNumberPrefix?: string

  @Field({ nullable: true })
  readonly nationalId?: string
}
