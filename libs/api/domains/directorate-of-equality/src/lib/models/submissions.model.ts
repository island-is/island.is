import { Field, ObjectType } from '@nestjs/graphql'

import { Submission } from './submission.model'

@ObjectType('DirectorateOfEqualitySubmissions')
export class Submissions {
  @Field(() => [Submission])
  items!: Submission[]
}
