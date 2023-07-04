import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { InstitutionType } from '@island.is/judicial-system/types'

registerEnumType(InstitutionType, { name: 'InstitutionType' })

@ObjectType()
export class Institution {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field(() => InstitutionType)
  readonly type!: InstitutionType

  @Field()
  readonly name!: string

  @Field()
  readonly active!: boolean

  @Field({ nullable: true })
  readonly defaultCourtId?: string

  @Field({ nullable: true })
  readonly policeCaseNumberPrefix?: string

  @Field({ nullable: true })
  readonly nationalId?: string
}
