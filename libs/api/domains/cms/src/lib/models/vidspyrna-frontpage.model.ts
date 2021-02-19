
    
    import { Field, ObjectType } from '@nestjs/graphql'
    import { ApolloError } from 'apollo-server-express'
    

    import { IVidspyrna-frontpage, IVidspyrnaFeaturedNews,IVidspyrnaFlokkur } from '../generated/contentfulTypes'
    import { Image, mapImage } from './image.model'
    import { ArticleGroup } from './articleGroup.model'
import { ArticleCategory } from './articleCategory.model'
import { Organization, mapOrganization } from './organization.model'
import { VidspyrnaFeaturedNews, mapVidspyrnaFeaturedNews } from './vidspyrnaFeaturedNews.model'
import { VidspyrnaFlokkur, mapVidspyrnaFlokkur } from './vidspyrnaFlokkur.model'

    @ObjectType()
    export class Vidspyrna-frontpage {
      
      
        @Field()
        title: string

  
        @Field({ nullable: true })
        description?: string

  
        @Field()
        slug: string

  
        @Field({ nullable: true })
        content?: string

  
        @Field(() => ArticleGroup, { nullable: true })
        group?: ArticleGroup

  
        @Field(() => ArticleCategory, { nullable: true })
        category?: ArticleCategory

  
        @Field(() => [Organization])
        organization?: Array<Organization>

  
        @Field(() => [VidspyrnaFeaturedNews,VidspyrnaFlokkur])
        slices: Array<VidspyrnaFeaturedNews | VidspyrnaFlokkur>

  
        @Field({ nullable: true })
        featuredImage?: Image
    }

    
    const mapSlice = (slice: IVidspyrnaFeaturedNews|IVidspyrnaFlokkur) => {
      switch (slice.sys.contentType.sys.id) {
        case 'vidspyrnaFeaturedNews':
          return mapVidspyrnaFeaturedNews(slice as IVidspyrnaFeaturedNews)
case 'vidspyrnaFlokkur':
          return mapVidspyrnaFlokkur(slice as IVidspyrnaFlokkur)

        default:
          throw new ApolloError(`Cannot convert to slice: ${(slice.sys.contentType.sys as { id: string }).id}`)
      }
    }
    
      export const mapVidspyrna-frontpage = ({ fields  }: IVidspyrna-frontpage): Vidspyrna-frontpage => ({
        
        title: fields.title ,
  description: fields.description ?? '',
  slug: fields.slug ,
  content: fields.content && JSON.stringify(fields.content) ?? null,
  group: fields.group?.fields ,
  category: fields.category?.fields ,
  organization: (fields.organization ?? []).map(mapOrganization) ,
  slices: fields.slices.map(mapSlice) ,
  featuredImage: mapImage(fields.featuredImage) ,
      })
    
  