import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CaseRepresentativeType } from '@island.is/judicial-system/types'

registerEnumType(CaseRepresentativeType, { name: 'CaseRepresentativeType' })

@ObjectType()
export class CaseRepresentative {
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => String)
  readonly name!: string

  @Field(() => CaseRepresentativeType)
  readonly type!: CaseRepresentativeType
}
