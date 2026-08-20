import { Field, InputType, Int } from '@nestjs/graphql'

// Shared by both employee list queries (with/without steps) — same paging shape either way.
@InputType('DirectorateOfEqualityDraftEmployeesInput')
export class DraftEmployeesInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
