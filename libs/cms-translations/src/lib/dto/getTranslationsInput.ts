import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetTranslationsInput {
  @Field(() => [String])
  @IsString({ each: true })
  namespaces!: Array<string>

  @Field()
  @IsString()
  lang!: string
}
