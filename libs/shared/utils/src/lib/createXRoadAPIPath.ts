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
    logger.error('xRoad base path not provided.')
  }

  if (!xRoadMemberClass) {
    logger.error('xRoad member class not provided.')
  }

  if (!xRoadMemberCode) {
    logger.error('xRoad member code not provided.')
  }

  if (!xRoadMemberAPIPath) {
    logger.error('xRoad member API path not provided.')
  }

  return `${xRoadBasePath}/${xRoadMemberClass}/${xRoadMemberCode}${xRoadMemberAPIPath}`
}
