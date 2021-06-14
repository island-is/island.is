import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsOptional, IsBoolean } from 'class-validator'


@InputType()
export class UpdatePaymentStatus {
  @Field()
  @IsString()
  applicationId!: string
  
  @Field()
  @IsBoolean()
  fulfilled!: boolean

  @Field()
  @IsString()
  @IsOptional()
  id?: string
}
