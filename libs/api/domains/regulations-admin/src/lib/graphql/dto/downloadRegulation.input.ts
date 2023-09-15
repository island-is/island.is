import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType({ description: 'Get a download URL for a draft regulation' })
export class GetDraftRegulationPdfDownloadInput {
  @Field({ description: 'Id of the draft regulation' })
  @IsString()
  draftId!: string
}
