import { LinkType } from '../hooks'

export enum AnchorPageType {
  DIGITAL_ICELAND_SERVICE = 'Digital Iceland Service',
  DIGITAL_ICELAND_COMMUNITY_PAGE = 'Digital Iceland Community Page',
}
export const extractAnchorPageLinkType = ({
  pageType,
}: {
  pageType?: string | null
}): LinkType => {
  return pageType === AnchorPageType.DIGITAL_ICELAND_COMMUNITY_PAGE ? 'digitalicelandcommunitydetailpage' : 'digitalicelandservicesdetailpage'
}
