import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IStepper } from '../generated/contentfulTypes'
import { SystemMetadata } from 'api-cms-domain'
import { mapStep, Step } from './step.model'

@ObjectType()
export class Stepper {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @CacheField(() => [Step], { nullable: true })
  steps?: Array<Step>

  @Field({ nullable: true })
  config?: string
}

export const mapStepper = ({
  sys,
  fields,
}: IStepper): SystemMetadata<Stepper> => ({
  typename: 'Stepper',
  id: sys.id,
  title: fields.title ?? '',
  steps: (fields.steps ?? []).map(mapStep),
  config: fields.config ? JSON.stringify(fields.config) : '',
})
