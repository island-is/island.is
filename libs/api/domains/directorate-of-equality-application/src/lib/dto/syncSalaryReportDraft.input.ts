import { Field, InputType } from '@nestjs/graphql'

import { SyncCommandInput } from './syncCommand.input'

// `applicationId` is both the island.is application UUID and the DMR draft's providerId, used to identify the draft and to verify ownership before forwarding to DMR.
@InputType('DirectorateOfEqualitySyncSalaryReportDraftInput')
export class SyncSalaryReportDraftInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String, { nullable: true })
  locale?: string

  @Field(() => [SyncCommandInput], { nullable: true })
  criteria?: SyncCommandInput[]

  @Field(() => [SyncCommandInput], { nullable: true })
  subCriteria?: SyncCommandInput[]

  @Field(() => [SyncCommandInput], { nullable: true })
  steps?: SyncCommandInput[]

  @Field(() => [SyncCommandInput], { nullable: true })
  roles?: SyncCommandInput[]

  @Field(() => [SyncCommandInput], { nullable: true })
  employees?: SyncCommandInput[]

  @Field(() => [SyncCommandInput], { nullable: true })
  outlierGroups?: SyncCommandInput[]
}
