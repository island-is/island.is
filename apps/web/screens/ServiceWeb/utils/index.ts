export { getSlugPart } from './getSlugPart'
export { getServiceWebSearchTagQuery } from './getServiceWebSearchTagQuery'

export const shouldShowInstitutionContactBanner = (institutionSlug: string) => {
  return (
    !institutionSlug ||
    (!institutionSlug.includes('tryggingastofnun') &&
      !institutionSlug.includes('social-insurance-administration') &&
      !institutionSlug.includes('vefstjorar') &&
      !institutionSlug.includes('web-masters'))
  )
}
