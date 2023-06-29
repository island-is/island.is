export enum EducationPaths {
  EducationRoot = '/menntun',
  EducationGrunnskoli = '/menntun/grunnskoli',
  EducationAssessment = '/menntun/grunnskoli/namsmat',

  EducationFramhskoli = '/menntun/framhaldsskoli',
  EducationFramhskoliCareer = '/menntun/framhaldsskoli/namsferill',
  EducationFramhskoliGraduationOverview = '/menntun/framhaldsskoli/utskrift',
  EducationFramhskoliGraduationSingle = '/menntun/framhaldsskoli/utskrift/:id',
  EducationFramhskoliGraduationDetail = '/menntun/framhaldsskoli/utskrift/:id/:detail',

  EducationHaskoli = '/menntun/haskoli',
  EducationHaskoliGraduation = '/menntun/haskoli/brautskraning',
  EducationHaskoliGraduationDetail = '/menntun/haskoli/brautskraning/:id',

  EducationDrivingLessons = '/menntun/okunam',
}
