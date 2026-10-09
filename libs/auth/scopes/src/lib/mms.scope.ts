export enum MMSScope {
  nemendagrunnur = '@mms.is/nemendagrunnur',
  framhaldsskolaumsokn = '@mms.is/framhaldsskolaumsokn',
  namsbrautagrunnur = '@mms.is/namsbrautagrunnur',
  // Mínar síður "Lykilupplýsingar" on the Frigg form-api gate each section
  // behind its own scope. Confirmed from live 403s: emergency contacts and the
  // language profile need `student.info.read`; the health profile needs
  // `student.health.read`. The edit/delete operations almost certainly need
  // matching write scopes (names not yet confirmed by MMS).
  studentInfoRead = '@mms.is/student.info.read',
  studentHealthRead = '@mms.is/student.health.read',
}
