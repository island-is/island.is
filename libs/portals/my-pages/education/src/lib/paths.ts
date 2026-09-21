export enum EducationPaths {
  EducationRoot = '/menntun',
  EducationPrimarySchool = '/menntun/grunnskoli',
  /** @deprecated Redirects to EducationPrimarySchool */
  EducationAssessment = '/menntun/grunnskoli/namsmat',

  // Primary school (guardian-facing)
  PrimarySchoolList = '/menntun/grunnskoli/nemendur',
  PrimarySchoolStudent = '/menntun/grunnskoli/nemendur/:studentId',
  PrimarySchoolOverview = '/menntun/grunnskoli/nemendur/:studentId/yfirlit',
  PrimarySchoolContactAdd = '/menntun/grunnskoli/nemendur/:studentId/yfirlit/adstandendur/nyr',
  PrimarySchoolContactEdit = '/menntun/grunnskoli/nemendur/:studentId/yfirlit/adstandendur/:agentId',
  PrimarySchoolLanguageEdit = '/menntun/grunnskoli/nemendur/:studentId/yfirlit/tungumalaumhverfi',
  PrimarySchoolHealthEdit = '/menntun/grunnskoli/nemendur/:studentId/yfirlit/heilsufarsupplysingar',
  PrimarySchoolAssessment = '/menntun/grunnskoli/nemendur/:studentId/namsmat',

  EducationFramhskoli = '/menntun/framhaldsskoli',
  EducationFramhskoliCareer = '/menntun/framhaldsskoli/namsferill',
  EducationFramhskoliGraduationOverview = '/menntun/framhaldsskoli/utskrift',
  EducationFramhskoliGraduationSingle = '/menntun/framhaldsskoli/utskrift/:id',
  EducationFramhskoliGraduationDetail = '/menntun/framhaldsskoli/utskrift/:id/:detail',

  EducationHaskoli = '/menntun/haskoli',
  EducationHaskoliGraduation = '/menntun/haskoli/brautskraning',
  EducationHaskoliGraduationDetail = '/menntun/haskoli/brautskraning/:uni/:id',

  EducationHaskoliMicroCredentials = '/menntun/haskoli/ornam',
  EducationHaskoliMicroCredentialsDetail = '/menntun/haskoli/ornam/:uni/:id',

  EducationDrivingLessons = '/menntun/okunam',
}
