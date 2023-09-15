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
  return `${xRoadBasePath}/${xRoadMemberClass}/${xRoadMemberCode}${xRoadMemberAPIPath}`
}
