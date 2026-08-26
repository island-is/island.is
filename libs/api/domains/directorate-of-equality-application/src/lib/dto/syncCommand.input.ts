import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { SyncMethodEnum } from '@island.is/clients/directorate-of-equality'

// `data` is passed through as raw JSON rather than typed per field — DMR's own validation (Change*Dto) is the source of truth for each collection's shape.
@InputType('DirectorateOfEqualitySyncCommandInput')
export class SyncCommandInput {
  @Field(() => String)
  method!: SyncMethodEnum

  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  data?: Record<string, unknown>
}
