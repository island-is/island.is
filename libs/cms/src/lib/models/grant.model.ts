
    
    import { Field, ObjectType } from '@nestjs/graphql'
    
    

    import { IGrant,  } from '../generated/contentfulTypes'
    import { Image, mapImage } from './image.model'
    import { LinkUrl } from './linkUrl.model'
import { Organization } from './organization.model'
import { GenericTag } from './genericTag.model'
import { GenericTag } from './genericTag.model'

    @ObjectType()
    export class Grant {
      
      
        @Field()
        grantName: string

  
        @Field({ nullable: true })
        grantDescription?: string

  
        @Field({ nullable: true })
        grantApplicationId?: string

  
        @Field(() => [String])
        grantApplicationDeadlineText: Array<string>

  
        @Field(() => LinkUrl, { nullable: true })
        granApplicationUrl?: LinkUrl

  
        @Field({ nullable: true })
        grantWhatIsGranted?: string

  
        @Field({ nullable: true })
        grantSpecialEmphasis?: string

  
        @Field({ nullable: true })
        grantWhoCanApply?: string

  
        @Field({ nullable: true })
        grantHowToApply?: string

  
        @Field({ nullable: true })
        grantApplicationDeadline?: string

  
        @Field({ nullable: true })
        grantDateFrom?: string

  
        @Field({ nullable: true })
        grantDateTo?: string

  
        @Field({ nullable: true })
        grantIsOpen?: boolean

  
        @Field({ nullable: true })
        grantStatus?: string

  
        @Field(() => Organization)
        grantOrganization: Organization

  
        @Field(() => [Image])
        grantFiles?: Array<Image>

  
        @Field(() => GenericTag, { nullable: true })
        grantCategoryTag?: GenericTag

  
        @Field(() => GenericTag, { nullable: true })
        grantTypeTag?: GenericTag
    }

    
    
      export const mapGrant = ({ fields  }: IGrant): Grant => ({
        undefined
        grantName: fields.grantName ,
  grantDescription: fields.grantDescription && JSON.stringify(fields.grantDescription) ?? null,
  grantApplicationId: fields.grantApplicationId ?? '',
  grantApplicationDeadlineText: fields.grantApplicationDeadlineText ,
  granApplicationUrl: fields.granApplicationUrl?.fields ,
  grantWhatIsGranted: fields.grantWhatIsGranted && JSON.stringify(fields.grantWhatIsGranted) ?? null,
  grantSpecialEmphasis: fields.grantSpecialEmphasis && JSON.stringify(fields.grantSpecialEmphasis) ?? null,
  grantWhoCanApply: fields.grantWhoCanApply && JSON.stringify(fields.grantWhoCanApply) ?? null,
  grantHowToApply: fields.grantHowToApply && JSON.stringify(fields.grantHowToApply) ?? null,
  grantApplicationDeadline: fields.grantApplicationDeadline && JSON.stringify(fields.grantApplicationDeadline) ?? null,
  grantDateFrom: fields.grantDateFrom ?? '',
  grantDateTo: fields.grantDateTo ?? '',
  grantIsOpen: fields.grantIsOpen ?? '',
  grantStatus: fields.grantStatus ?? '',
  grantOrganization: fields.grantOrganization?.fields ,
  grantFiles: (fields.grantFiles ?? []).map(mapImage) ?? [],
  grantCategoryTag: fields.grantCategoryTag?.fields ,
  grantTypeTag: fields.grantTypeTag?.fields ,
      })
    
  