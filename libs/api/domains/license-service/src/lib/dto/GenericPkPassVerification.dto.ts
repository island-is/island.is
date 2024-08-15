import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenericPkPassVerificationError {
  @Field({
    nullable: true,
    description:
      'pkpass verification error code, depandant on origination service, "0" for unknown error',
  })
  status?: string

  @Field({
    nullable: true,
    description:
      'pkpass verification error message, depandant on origination service',
  })
  message?: string

  @Field({
    nullable: true,
    description: 'Optional data related to the error',
  })
  data?: string
}

@ObjectType()
export class GenericPkPassVerification {
  @Field({
    nullable: true,
    description: 'Optional data related to the pkpass verification',
  })
  data?: string

  @Field(() => GenericPkPassVerificationError, {
    nullable: true,
    description: 'Optional error related to the pkpass verification',
  })
  error?: GenericPkPassVerificationError

  @Field({ description: 'Is the pkpass valid?' })
  valid!: boolean
}
