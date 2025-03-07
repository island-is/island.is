import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@InputType()
export class SeminarIndividual {
  @Field()
  @IsString()
  nationalId?: string

  @Field()
  @IsString()
  email?: string
}

@InputType()
export class ValidateSeminarIndividualsInput {
  @CacheField(() => [SeminarIndividual])
  individuals!: SeminarIndividual[]
}
