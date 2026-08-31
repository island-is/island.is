import { Field, InputType } from '@nestjs/graphql'

@InputType('DirectorateOfEqualityEditEqualityContentInput')
export class EditEqualityContentInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  equalityReportContent!: string
}
