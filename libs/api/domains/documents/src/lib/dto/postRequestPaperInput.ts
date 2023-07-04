import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@InputType()
export class PostRequestPaperInput {
  @Field()
  @IsBoolean()
  wantsPaper!: boolean
}
