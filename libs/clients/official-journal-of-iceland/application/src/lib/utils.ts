import {
  AdvertTemplateDetailsSlugEnum,
  GetAdvertTemplateResponseTypeEnum,
} from '../../gen/fetch'
import { TemplateType } from './ojoiApplicationClient.types'

const templateMap: Record<
  AdvertTemplateDetailsSlugEnum | GetAdvertTemplateResponseTypeEnum,
  TemplateType
> = {
  auglysing: 'auglysing',
  reglugerd: 'reglugerd',
  gjaldskra: 'gjaldskra',
}

export const mapTemplateEnumToLiteral = (
  type: AdvertTemplateDetailsSlugEnum | GetAdvertTemplateResponseTypeEnum,
): TemplateType => {
  return templateMap[type]
}
