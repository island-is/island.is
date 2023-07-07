import { Field, ObjectType } from '@nestjs/graphql'
import { PatentCollectionEntry } from './getPatentCollection.model'
import { TrademarkCollectionEntry } from './getTrademarkCollection.model'
import { DesignCollectionEntry } from './getDesignCollection.model'

@ObjectType('IntellectualProperties')
export class IntellectualProperties {
  @Field(() => [PatentCollectionEntry], { nullable: true })
  patents?: Array<PatentCollectionEntry> | null

  @Field(() => [TrademarkCollectionEntry], { nullable: true })
  trademarks?: Array<TrademarkCollectionEntry> | null

  @Field(() => [DesignCollectionEntry], { nullable: true })
  designs?: Array<DesignCollectionEntry> | null
}
