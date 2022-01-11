import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class DownloadRegulationInput {
  @Field()
  @IsString()
  regulationId!: string
}
