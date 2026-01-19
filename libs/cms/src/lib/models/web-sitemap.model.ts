import { CacheField } from "@island.is/nest/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
class WebSitemapItem {
    @Field(() => String)
    icelandicUrl!: string

    @Field(() => String)
    englishUrl!: string

    @Field(() => String)
    lastModified!: string
}

@ObjectType()
export class WebSitemap {
    @CacheField(() => [WebSitemapItem])
    items!: WebSitemapItem[]
}