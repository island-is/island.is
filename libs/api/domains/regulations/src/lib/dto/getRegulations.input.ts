import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

@InputType()
export class GetRegulationsInput {
  @Field()
  @IsString()
  type!: 'newest'

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number
}
