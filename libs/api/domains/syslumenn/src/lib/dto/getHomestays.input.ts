import {IsNumber} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class GetHomestaysInput {
  @Field()
  @IsNumber()
  year: number
}
