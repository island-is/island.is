import { Field, ObjectType } from '@nestjs/graphql'
import { PermitHistoryEntry } from './permitHistoryEntry.model'
import { Permit } from './permit.model'

@ObjectType('HealthDirectoratePatientDataPermits')
export class Permits {
  @Field(() => Permit, { nullable: true })
  consent!: Permit | null

  @Field(() => [PermitHistoryEntry])
  history!: PermitHistoryEntry[]
}
