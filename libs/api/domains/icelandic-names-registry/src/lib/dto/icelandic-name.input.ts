import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsString, Length } from 'class-validator'

@InputType()
export class GetIcelandicNameByIdInput {
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
export class IcelandicNameBody {
  @Field()
  @IsNumber()
  id!: number

  @Field()
  @IsString()
  icelandic_name!: string

  @Field()
  @IsString()
  type!: string

  @Field()
  @IsString()
  status!: string

  @Field()
  @IsString()
  verdict!: string

  @Field()
  @IsString()
  description!: string

  @Field()
  @IsBoolean()
  visible!: boolean

  @Field()
  @IsString()
  url!: string
}
