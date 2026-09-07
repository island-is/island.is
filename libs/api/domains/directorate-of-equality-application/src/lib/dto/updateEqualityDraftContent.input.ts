import { Field, InputType } from '@nestjs/graphql'

@InputType('DirectorateOfEqualityUpdateEqualityDraftContentInput')
export class UpdateEqualityDraftContentInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  equalityReportContent!: string
}
