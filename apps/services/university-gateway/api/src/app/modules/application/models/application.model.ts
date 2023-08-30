import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import {
  ApplicationStatus,
  ModeOfDelivery,
} from '@island.is/university-gateway-types'
import type { Application as TApplication } from '@island.is/university-gateway-types'

registerEnumType(ApplicationStatus, { name: 'ApplicationStatus' })
registerEnumType(ModeOfDelivery, { name: 'ModeOfDelivery' })

@ObjectType()
export class Application implements TApplication {
  @Field(() => ID)
  readonly id!: string

  @Field()
  nationalId!: string

  @Field()
  universityId!: string

  @Field()
  programId!: string

  @Field(() => ModeOfDelivery)
  modeOfDelivery!: ModeOfDelivery

  @Field(() => ApplicationStatus)
  status!: ApplicationStatus

  @Field()
  created!: Date

  @Field()
  modified!: Date

  @Field(() => Application)
  data!: Application
}
