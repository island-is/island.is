import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsNumber } from 'class-validator'

// inp.samkv. datamodeli
// permno
// nationalid
// recyclingCompanieId
// recyclingCompanieName
// deregisterDescription

@InputType()
export class DeregisterCarInput {
  @Field((_) => String)
  @IsOptional()
  permno: string

  @Field((_) => String)
  @IsOptional()
  nationalid: string

  @Field((_) => Number)
  @IsOptional()
  @IsNumber()
  recyclingCompanyId: number

  @Field((_) => String)
  @IsOptional()
  recyclingCompanyName: string

  @Field((_) => String, { nullable: true })
  @IsOptional()
  deregisterDescription: string
}
