import { IsBase64 } from 'class-validator'

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PdfModel {
  @Field(() => String, { description: 'Base64 encoded PDF file' })
  @IsBase64({
    message: 'File must be a valid base64 encoded string',
  })
  readonly file!: string
}
