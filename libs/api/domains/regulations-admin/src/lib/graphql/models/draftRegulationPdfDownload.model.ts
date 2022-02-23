import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType({
  description: 'Info about how to download the draft regulation PDF',
})
export class DraftRegulationPdfDownloadModel {
  @Field(() => Boolean, {
    defaultValue: false,
    description:
      'Does the download go through the download service? If true needs special handling in client',
  })
  downloadService!: boolean

  @Field(() => String, {
    nullable: true,
    description: 'URL of the draft regulation PDF file',
  })
  url?: string
}
