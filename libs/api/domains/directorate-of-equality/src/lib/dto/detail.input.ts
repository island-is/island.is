import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DirectorateOfEqualityDetailInput')
export class DetailInput {
  @Field(() => String, {
    description: 'The submission id from directorateOfEqualitySubmissions',
  })
  @IsString()
  id!: string
}
