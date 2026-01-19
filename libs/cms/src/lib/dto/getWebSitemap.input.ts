import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@InputType()
@ObjectType()
export class GetWebSitemapInput {
    @Field(() => Int)
    page!: number
}