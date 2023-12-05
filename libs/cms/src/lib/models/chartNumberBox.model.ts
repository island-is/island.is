import { Field, ID, ObjectType } from '@nestjs/graphql'
import pick from 'lodash/pick'

import { SystemMetadata } from '@island.is/shared/types'

import { IChartNumberBox } from '../generated/contentfulTypes'

@ObjectType()
export class ChartNumberBox {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  numberBoxDescription!: string

  @Field()
  sourceDataKey!: string

  @Field(() => String)
  valueType!: string

  @Field()
  displayChangeMonthOverMonth!: boolean

  @Field()
  displayChangeYearOverYear?: boolean

  @Field({ nullable: true })
  numberBoxDate?: string
}

export const mapChartNumberBox = ({
  sys,
  fields,
}: IChartNumberBox): SystemMetadata<ChartNumberBox> => {
  return {
    id: sys.id,
    typename: 'ChartNumberBox',
    ...pick(fields, [
      'title',
      'numberBoxDescription',
      'sourceDataKey',
      'valueType',
      'displayChangeMonthOverMonth',
      'displayChangeYearOverYear',
    ]),
    numberBoxDate: fields.numberBoxDate ?? undefined,
  }
}
