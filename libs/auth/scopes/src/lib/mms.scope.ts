export enum MMSScope {
  nemendagrunnur = '@mms.is/nemendagrunnur',
  framhaldsskolaumsokn = '@mms.is/framhaldsskolaumsokn',
  namsbrautagrunnur = '@mms.is/namsbrautagrunnur',
  // Mínar síður "Lykilupplýsingar" on the Frigg form-api gates each section
  // behind its own scope, with read and write split. Emergency contacts and the
  // language profile sit behind `student.info.*`, the health profile behind
  // `student.health.*`. MMS names the write scopes `.modify`, not `.write`.
  // All four confirmed against live 403s from the form-api.
  studentInfoRead = '@mms.is/student.info.read',
  studentHealthRead = '@mms.is/student.health.read',
  studentInfoModify = '@mms.is/student.info.modify',
  studentHealthModify = '@mms.is/student.health.modify',
}
