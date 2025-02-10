import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionAreaSummaryReportInput {
  @Field()
  @IsString()
  areaId!: string

  @Field()
  @IsString()
  collectionId!: string
}
