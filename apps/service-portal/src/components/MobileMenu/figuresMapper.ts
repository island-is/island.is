import {
  AssetsFigure,
  EducationFigure,
  FamilyFigure,
  ServicePortalPath,
  ShoppingFigure,
  StudyFigure,
  WateringFigure,
} from '@island.is/service-portal/core'

export const getMobileMenuFigure = (path: ServicePortalPath | undefined) => {
  if (path === ServicePortalPath.FjarmalRoot) return StudyFigure
  if (path === ServicePortalPath.FjolskyldanRoot) return FamilyFigure
  if (path === ServicePortalPath.HeilsaRoot) return WateringFigure
  if (path === ServicePortalPath.MenntunRoot) return EducationFigure
  if (path === ServicePortalPath.EignirRoot) return AssetsFigure
  return ShoppingFigure
}
