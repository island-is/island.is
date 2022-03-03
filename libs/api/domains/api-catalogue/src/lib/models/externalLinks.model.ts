import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

import { ExternalLinks as IExternalLinks } from '@island.is/api-catalogue/types'

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
