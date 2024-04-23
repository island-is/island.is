import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { DateType } from '@island.is/judicial-system/types'

registerEnumType(DateType, { name: 'DateType' })

@ObjectType()
export class DateLog {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly caseId?: string

  @Field(() => DateType, { nullable: true })
  readonly dateType?: DateType

  @Field({ nullable: true })
  readonly date?: string

  @Field({ nullable: true })
  readonly location?: string
}
