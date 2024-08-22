import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExportUrlResponse {
  @Field()
  url!: string;
}