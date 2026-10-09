import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum StepUpMethod {
  app = 'app',
  sim = 'sim',
}

registerEnumType(StepUpMethod, {
  name: 'StepUpMethod',
  description: 'Where the person approves: the Auðkenni app, or by SIM.',
})

export enum StepUpStatus {
  not_started = 'not_started',
  pending = 'pending',
  confirmed = 'confirmed',
  denied = 'denied',
  timed_out = 'timed_out',
  expired = 'expired',
}

registerEnumType(StepUpStatus, { name: 'StepUpStatus' })

@ObjectType('StepUpStart')
export class StepUpStart {
  @Field(() => ID)
  stepUpId!: string

  @Field(() => StepUpMethod)
  method!: StepUpMethod

  @Field(() => String, {
    nullable: true,
    description: 'Shown in the Auðkenni app too, for the person to compare.',
  })
  verificationCode?: string

  @Field(() => Int, { description: 'Seconds between status checks.' })
  interval!: number

  @Field(() => Int, { description: 'Seconds until the request gives up.' })
  expiresIn!: number
}

@ObjectType('StepUpSession')
export class StepUpSession {
  @Field(() => Boolean)
  unlocked!: boolean

  @Field(() => Date, {
    nullable: true,
    description: 'The latest it locks again. Not using it locks it sooner.',
  })
  expiresAt?: Date

  @Field(() => Int, {
    description: 'Locks again after this many seconds without use.',
  })
  idleSeconds!: number
}
