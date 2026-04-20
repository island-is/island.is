import { Field, ObjectType } from '@nestjs/graphql'

import { PoliceDigitalCaseFile } from './policeDigitalCaseFile.model'

@ObjectType()
export class UpdatePoliceDigitalCaseFilesResponse {
  @Field(() => [PoliceDigitalCaseFile])
  readonly policeDigitalCaseFiles!: PoliceDigitalCaseFile[]
}
