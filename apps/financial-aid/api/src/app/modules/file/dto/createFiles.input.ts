import { Allow } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { CreateApplicationFileInput } from './createFile.input'

@InputType()
export class CreateApplicationFilesInput {
  @Allow()
  @Field(() => [CreateFileInput])
  readonly files!: CreateFileInput[]
}

@InputType()
class CreateFileInput extends CreateApplicationFileInput {
  @Allow()
  @Field()
  readonly applicationId!: string
}
