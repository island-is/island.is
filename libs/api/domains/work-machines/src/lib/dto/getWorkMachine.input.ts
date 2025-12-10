import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType('WorkMachinesInput')
export class GetWorkMachineInput {
  @Field({
    nullable: true,
    description:
      'Work machine id, must pass in either this or the registration number',
  })
  @IsString()
  @IsOptional()
  id?: string

  @Field({
    nullable: true,
    description:
      'Work machine registration number, must pass in either this or the id',
  })
  @IsString()
  @IsOptional()
  registrationNumber?: string

  @Field()
  @IsString()
  locale!: string
}
