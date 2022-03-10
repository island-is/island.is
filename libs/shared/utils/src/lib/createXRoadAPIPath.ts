import { logger } from '@island.is/logging'

export enum XRoadMemberClass {
  GovernmentInstitution = 'GOV',
  EducationalInstitution = 'EDU',
  PrivateCompany = 'COM',
}

/**
 * Constructs a valid X-Road API base url from the various parts required
 */
export const createXRoadAPIPath = (
  xRoadBasePath: string,
  xRoadMemberClass: XRoadMemberClass,
  xRoadMemberCode: string,
  xRoadMemberAPIPath: string,
) => {
  if (!xRoadBasePath) {
    logger.error('XRoad XROAD_BASE_PATH_WITH_ENV not provided.')
  }

  if (!xRoadMemberClass) {
    logger.error('XRoad XROAD_VMST_MEMBER_CLASS not provided.')
  }

  if (!xRoadMemberCode) {
    logger.error('XRoad XROAD_VMST_MEMBER_CODE not provided.')
  }

  if (!xRoadMemberAPIPath) {
    logger.error('XRoad XROAD_VMST_API_PATH not provided.')
  }

  return `${xRoadBasePath}/${xRoadMemberClass}/${xRoadMemberCode}${xRoadMemberAPIPath}`
}
