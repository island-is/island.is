import { Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

export class OwnerInfoDto {
  @Field({nullable: true})
  @IsString()
  fullName!: string
}
