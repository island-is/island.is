import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CaseFileCategory } from '@island.is/judicial-system/types'

registerEnumType(CaseFileCategory, { name: 'CaseFileCategory' })

@ObjectType()
export class CaseRepresentative {
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => String)
  readonly name!: string

  @Field(() => CaseFileCategory)
  readonly caseFileCategory!: CaseFileCategory
}
