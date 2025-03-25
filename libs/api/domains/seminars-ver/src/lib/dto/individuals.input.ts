import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@InputType()
export class SeminarIndividual {
  @Field({ nullable: true })
  @IsString()
  nationalId?: string

  @Field({ nullable: true })
  @IsString()
  email?: string
}

@InputType()
export class ValidateSeminarIndividualsInput {
  @CacheField(() => [SeminarIndividual])
  individuals!: SeminarIndividual[]
}
