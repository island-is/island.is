import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IPowerBiSlice } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class PowerBiSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  powerBiEmbedProps!: string
}

export const mapPowerBiSlice = ({
  fields,
  sys,
}: IPowerBiSlice): SystemMetadata<PowerBiSlice> => {
  return {
    typename: 'PowerBiSlice',
    id: sys.id,
    title: fields.title ?? '',
    powerBiEmbedProps: fields.config ? JSON.stringify(fields.config) : '{}',
  }
}
