import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  CourtSessionClosedLegalBasis,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

import { User } from '../../user'

registerEnumType(CourtSessionClosedLegalBasis, {
  name: 'CourtSessionClosedLegalBasis',
})

registerEnumType(CourtSessionRulingType, {
  name: 'CourtSessionRulingType',
})

@ObjectType()
export class CourtSessionResponse {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly created!: string

  @Field(() => String)
  readonly modified!: string

  @Field(() => ID)
  readonly caseId!: string

  @Field(() => String, { nullable: true })
  readonly location?: string

  @Field(() => String, { nullable: true })
  readonly startDate?: string

  @Field(() => String, { nullable: true })
  readonly endDate?: string

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

  @Field(() => String, { nullable: true })
  readonly attestingWitnessId?: string

  @Field(() => User, { nullable: true })
  readonly attestingWitness?: User

  @Field(() => String, { nullable: true })
  readonly closingEntries?: string
}
