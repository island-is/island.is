import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class OJOIAGetRegulationFromApiInput {
  @Field()
  regulation!: string

  @Field({ nullable: true })
  @IsOptional()
  date?: string
}
