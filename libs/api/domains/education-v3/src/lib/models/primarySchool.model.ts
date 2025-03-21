import { ObjectType } from '@nestjs/graphql'
import { Entity } from './interfaces/entity.model'

@ObjectType('EducationV3PrimarySchool', {
  implements: () => Entity,
})
export class PrimarySchool extends Entity {}
