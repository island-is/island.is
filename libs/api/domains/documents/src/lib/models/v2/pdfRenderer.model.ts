import { InputType, Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DocumentPdfRendererInput')
export class DocumentPdfRendererInput {
  @Field()
  @IsString()
  readonly id!: string

  @Field(() => Boolean)
  success!: boolean

  @Field({ nullable: true })
  error?: string

  @Field(() => Boolean, { nullable: true })
  isCourtCase?: boolean

  @Field(() => [String], { nullable: true })
  actions?: string[]
}

@ObjectType('DocumentPdfRenderer')
export class DocumentPdfRenderer {
  @Field()
  @IsString()
  readonly id!: string

  @Field(() => Boolean)
  success!: boolean
}
