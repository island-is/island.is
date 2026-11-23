import { Field, InputType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'

import { DirectorateOfEqualitySubmissionType } from '../models/enums'

@InputType('DirectorateOfEqualitySubmissionsInput')
export class SubmissionsInput {
  @Field(() => DirectorateOfEqualitySubmissionType)
  @IsEnum(DirectorateOfEqualitySubmissionType)
  type!: DirectorateOfEqualitySubmissionType
}
