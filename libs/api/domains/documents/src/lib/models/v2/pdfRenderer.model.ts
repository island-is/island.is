import { InputType, Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DocumentPdfRendererInput')
export class DocumentPdfRendererInput {
  @Field()
  @IsString()
  readonly id!: string

  @Field(() => Boolean)
  success!: boolean
}

@ObjectType('DocumentPdfRenderer')
export class DocumentPdfRenderer {
  @Field()
  @IsString()
  readonly id!: string

  @Field(() => Boolean)
  success!: boolean
}
