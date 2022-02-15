import { Field, ObjectType } from '@nestjs/graphql'
import { ExternalLinks as IExternalLinks } from '@island.is/api-catalogue/types'
import { IsString } from 'class-validator'

@ObjectType()
export class ExternalLinks implements IExternalLinks {
  @Field()
  @IsString()
  responsibleParty!: string

  @Field({ nullable: true })
  @IsString()
  documentation?: string

  @Field({ nullable: true })
  @IsString()
  bugReport?: string

  @Field({ nullable: true })
  @IsString()
  featureRequest?: string
}
