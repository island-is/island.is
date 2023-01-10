
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
    console.error('xRoad base path not provided.')
  }

  if (!xRoadMemberClass) {
    console.error('xRoad member class not provided.')
  }

  if (!xRoadMemberCode) {
    console.error('xRoad member code not provided.')
  }

  if (!xRoadMemberAPIPath) {
    console.error('xRoad member API path not provided.')
  }

  return `${xRoadBasePath}/${xRoadMemberClass}/${xRoadMemberCode}${xRoadMemberAPIPath}`
}
