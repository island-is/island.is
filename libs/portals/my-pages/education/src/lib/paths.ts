export enum EducationPaths {
  EducationRoot = '/menntun',
  EducationGrunnskoli = '/menntun/grunnskoli',
  EducationAssessment = '/menntun/grunnskoli/namsmat',

  // Primary school (guardian-facing)
  PrimarySchoolList = '/menntun/grunnskoli/nemendur',
  PrimarySchoolStudent = '/menntun/grunnskoli/nemendur/:studentId',
  PrimarySchoolOverview = '/menntun/grunnskoli/nemendur/:studentId/yfirlit',
  PrimarySchoolAssessment = '/menntun/grunnskoli/nemendur/:studentId/namsmat',

  EducationFramhskoli = '/menntun/framhaldsskoli',
  EducationFramhskoliCareer = '/menntun/framhaldsskoli/namsferill',
  EducationFramhskoliGraduationOverview = '/menntun/framhaldsskoli/utskrift',
  EducationFramhskoliGraduationSingle = '/menntun/framhaldsskoli/utskrift/:id',
  EducationFramhskoliGraduationDetail = '/menntun/framhaldsskoli/utskrift/:id/:detail',

  EducationHaskoli = '/menntun/haskoli',
  EducationHaskoliGraduation = '/menntun/haskoli/brautskraning',
  EducationHaskoliGraduationDetail = '/menntun/haskoli/brautskraning/:uni/:id',

  EducationDrivingLessons = '/menntun/okunam',
}
