import { Field, ObjectType } from '@nestjs/graphql'

import { CaseFile } from './file.model'

@ObjectType()
export class UpdateFilesResponse {
  @Field(() => [CaseFile])
  readonly caseFiles!: CaseFile[]
}
