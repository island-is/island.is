import { Field, InputType } from '@nestjs/graphql'

import { SyncCommandInput } from './syncCommand.input'

// Bulk-sync body for one screen's changes on a SALARY draft, forwarded to
// `POST .../reports/:providerId/draft/sync`. `applicationId` is the island.is
// application UUID — also the draft's `providerId` — used both to identify
// the DMR draft and to verify the caller owns this application before
// forwarding anything to DMR.
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
