import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum MedicineDelegationStepUpMethod {
  app = 'app',
  sim = 'sim',
}

export enum MedicineDelegationStepUpStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  denied = 'denied',
  expired = 'expired',
}

registerEnumType(MedicineDelegationStepUpMethod, {
  name: 'HealthDirectorateMedicineDelegationStepUpMethod',
})

registerEnumType(MedicineDelegationStepUpStatus, {
  name: 'HealthDirectorateMedicineDelegationStepUpStatus',
})

@ObjectType('HealthDirectorateMedicineDelegationStepUp')
export class MedicineDelegationStepUp {
  @Field()
  authReqId!: string

  @Field(() => MedicineDelegationStepUpMethod)
  method!: MedicineDelegationStepUpMethod

  @Field({ nullable: true })
  verificationCode?: string

  @Field(() => Int)
  interval!: number

  @Field(() => Int)
  expiresIn!: number
}

@ObjectType('HealthDirectorateMedicineDelegationCreateResponse')
export class MedicineDelegationCreateResponse {
  @Field(() => Boolean)
  success!: boolean

  @Field(() => String, { nullable: true })
  message?: string

  /** Set when the grant waits for an electronic ID authentication; nothing was saved. */
  @Field(() => MedicineDelegationStepUp, { nullable: true })
  stepUp?: MedicineDelegationStepUp
}

@ObjectType('HealthDirectorateMedicineDelegationStepUpResult')
export class MedicineDelegationStepUpResult {
  @Field(() => MedicineDelegationStepUpStatus)
  status!: MedicineDelegationStepUpStatus

  /** Whether the delegation was saved; only meaningful when confirmed. */
  @Field(() => Boolean)
  success!: boolean
}
