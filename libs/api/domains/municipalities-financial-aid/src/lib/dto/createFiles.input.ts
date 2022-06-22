import { Allow } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { CreateFileInput } from './createFile.input'

@InputType('MunicipalitiesFinancialAidApplicationFilesInput')
export class ApplicationFilesInput {
  @Allow()
  @Field(() => [ApplicationFileInput])
  readonly files!: ApplicationFileInput[]
}

@InputType()
class ApplicationFileInput extends CreateFileInput {
  @Allow()
  @Field()
  readonly applicationId!: string
}
