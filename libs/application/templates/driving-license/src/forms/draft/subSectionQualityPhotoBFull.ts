import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_FULL } from '../../lib/constants'

// B-full shows the redesign photo selector only when its redesign flag is on.
// With the flag off, the legacy `subSectionQualityPhoto` step handles B-full.
// Note: the health-certificate upload is intentionally NOT part of this flow yet
// — the full-license RLS endpoint has no `contentList` support, so only the
// photo selection is redesigned for now (same as B-temp).
export const subSectionQualityPhotoBFull = buildPhotoSelectorSubSection({
  id: 'photoStepBFull',
  applicationFor: B_FULL,
  redesignFlagKey: 'isBFullRedesignEnabled',
  withNoPhotoAlert: true,
})
