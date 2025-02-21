export enum EducationPaths {
  EducationRoot = '/menntun',
  EducationGrunnskoli = '/menntun/grunnskoli',
  EducationPrimarySchoolAssessment = '/menntun/grunnskoli/namsmat',
  EducationPrimarySchoolAssessmentDetail = '/menntun/grunnskoli/namsmat/:id',

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
