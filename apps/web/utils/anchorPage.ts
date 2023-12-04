import { LinkType } from '../hooks'

export enum AnchorPageType {
  LIFE_EVENT = 'Life Event',
  DIGITAL_ICELAND_SERVICE = 'Digital Iceland Service',
  DIGITAL_ICELAND_COMMUNITY_PAGE = 'Digital Iceland Community Page',
}
export const extractAnchorPageLinkType = ({
  pageType,
}: {
  pageType?: string | null
}) => {
  let linkType: LinkType = 'anchorpage'
  if (pageType === AnchorPageType.DIGITAL_ICELAND_SERVICE) {
    linkType = 'digitalicelandservicesdetailpage'
  } else if (pageType === AnchorPageType.DIGITAL_ICELAND_COMMUNITY_PAGE) {
    linkType = 'digitalicelandcommunitydetailpage'
  }

  return linkType
}
