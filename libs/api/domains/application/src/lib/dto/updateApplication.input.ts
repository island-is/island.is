import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { IsString, IsOptional, IsObject } from 'class-validator'
import { DraftProgressInput } from './draftProgress.input'

@InputType()
export class UpdateApplicationInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => DraftProgressInput, { nullable: true })
  @IsOptional()
  draftProgress?: DraftProgressInput

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  answers?: object
}
