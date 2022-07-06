import { Field, InputType } from '@nestjs/graphql'
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator'

@InputType()
export class GetIcelandicNameByIdInput {
  @Field()
  @IsNumber()
  id!: number
}

@InputType()
export class DeleteIcelandicNameByIdInput {
  @Field()
  @IsNumber()
  id!: number
}

@InputType()
export class GetIcelandicNameByInitialLetterInput {
  @Field()
  @IsString()
  @Length(1, 1)
  initialLetter!: string
}

@InputType()
export class GetIcelandicNameBySearchInput {
  @Field()
  @IsString()
  @MinLength(1)
  q!: string
}

@InputType()
export class CreateIcelandicNameInput {
  @Field()
  @IsString()
  icelandicName!: string

  @Field()
  @IsString()
  type!: string

  @Field()
  @IsString()
  status!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  verdict?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string

  @Field()
  @IsBoolean()
  visible!: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  url?: string
}

@InputType()
export class UpdateIcelandicNameInput {
  @Field()
  @IsNumber()
  id!: number

  @Field(() => CreateIcelandicNameInput)
  @IsObject()
  body!: CreateIcelandicNameInput
}
