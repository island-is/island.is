import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePatientDataPermitReturn')
export class PermitReturn {
  @Field()
  status!: boolean
}
