import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, Max, Min } from 'class-validator'

// Shared by both employee list queries (with/without steps) — same paging shape either way.
// Bounds mirror DMR's own `Paging.pageSize` (1..100).
@InputType('DirectorateOfEqualityDraftEmployeesInput')
export class DraftEmployeesInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(100)
  pageSize?: number
}
