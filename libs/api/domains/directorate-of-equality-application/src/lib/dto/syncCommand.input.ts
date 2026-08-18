import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { SyncMethodEnum } from '@island.is/clients/directorate-of-equality'

// One CREATE/UPDATE/REMOVE command in a `draft/sync` batch. `data` is passed
// through as JSON rather than modeled field-by-field per collection — DMR's
// own request validation is the source of truth for each collection's shape
// (see @dmr.is `Change*Dto` classes), this resolver is a thin, ownership-
// checked passthrough to `DirectorateOfEqualityClientService.syncDraft`.
@InputType('DirectorateOfEqualitySyncCommandInput')
export class SyncCommandInput {
  @Field(() => String)
  method!: SyncMethodEnum

  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  data?: Record<string, unknown>
}
