import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  CourtSessionClosedLegalBasis,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

import { User } from '../../user'

registerEnumType(CourtSessionClosedLegalBasis, {
  name: 'CourtSessionClosedLegalBasis',
})

@ObjectType()
export class CourtSession {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => String, { nullable: true })
  readonly location?: string

  @Field(() => Date, { nullable: true })
  readonly startDate?: Date

  @Field(() => Date, { nullable: true })
  readonly endDate?: Date

  @Field(() => Boolean, { nullable: true })
  readonly isClosed?: boolean

  @Field(() => [CourtSessionClosedLegalBasis], { nullable: true })
  readonly closedLegalProvisions?: CourtSessionClosedLegalBasis[]

  @Field(() => String, { nullable: true })
  readonly attendees?: string

  @Field(() => String, { nullable: true })
  readonly entries?: string

  @Field(() => CourtSessionRulingType, { nullable: true })
  readonly rulingType?: CourtSessionRulingType

  @Field(() => String, { nullable: true })
  readonly ruling?: string

  @Field(() => Boolean, { nullable: true })
  readonly isAttestingWitness?: boolean

  @Field(() => ID)
  readonly attestingWitnessId?: string

  @Field(() => User)
  readonly attestingWitness?: User

  @Field(() => String, { nullable: true })
  readonly closingEntries?: string
}
