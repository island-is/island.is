import { Field, ID, ObjectType } from '@nestjs/graphql'

import { DateType } from '@island.is/judicial-system/types'

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
  readonly courtDate?: string
}
