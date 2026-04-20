export enum CaseFileState {
  STORED_IN_RVG = 'STORED_IN_RVG',
  STORED_IN_COURT = 'STORED_IN_COURT',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export enum CaseFileCategory {
  COURT_RECORD = 'COURT_RECORD',
  RULING = 'RULING',
  CRIMINAL_RECORD = 'CRIMINAL_RECORD',
  CRIMINAL_RECORD_UPDATE = 'CRIMINAL_RECORD_UPDATE',
  COST_BREAKDOWN = 'COST_BREAKDOWN',
  CASE_FILE = 'CASE_FILE',
  CASE_FILE_RECORD = 'CASE_FILE_RECORD',
  PROSECUTOR_CASE_FILE = 'PROSECUTOR_CASE_FILE',
  DEFENDANT_CASE_FILE = 'DEFENDANT_CASE_FILE',
  PROSECUTOR_APPEAL_BRIEF = 'PROSECUTOR_APPEAL_BRIEF', // Sækjandi:  Kæruskjal til Landsréttar
  DEFENDANT_APPEAL_BRIEF = 'DEFENDANT_APPEAL_BRIEF', // Verjandi:  Kæruskjal til Landsréttar
  PROSECUTOR_APPEAL_BRIEF_CASE_FILE = 'PROSECUTOR_APPEAL_BRIEF_CASE_FILE', // Sækjandi: Fylgigögn kæruskjals til Landsréttar
  DEFENDANT_APPEAL_BRIEF_CASE_FILE = 'DEFENDANT_APPEAL_BRIEF_CASE_FILE', // Verjandi: Fylgigögn kæruskjals til Landsréttar
  PROSECUTOR_APPEAL_STATEMENT = 'PROSECUTOR_APPEAL_STATEMENT', // Sækjandi: Greinargerð
  DEFENDANT_APPEAL_STATEMENT = 'DEFENDANT_APPEAL_STATEMENT', // Verjandi: Greinargerð
  PROSECUTOR_APPEAL_STATEMENT_CASE_FILE = 'PROSECUTOR_APPEAL_STATEMENT_CASE_FILE', // Sækjandi: Fylgigögn greinargerðar
  DEFENDANT_APPEAL_STATEMENT_CASE_FILE = 'DEFENDANT_APPEAL_STATEMENT_CASE_FILE', // Verjandi: Fylgigögn greinargerðar
  PROSECUTOR_APPEAL_CASE_FILE = 'PROSECUTOR_APPEAL_CASE_FILE', // Sækjandi: Viðbótargögn við kæru til Landsréttar
  DEFENDANT_APPEAL_CASE_FILE = 'DEFENDANT_APPEAL_CASE_FILE', // Verjandi: Viðbótargögn við kæru til Landsréttar
  INDEPENDENT_DEFENDANT_CASE_FILE = 'INDEPENDENT_DEFENDANT_CASE_FILE', // Varnaraðili: Innsend gögn í dómssal
  CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE = 'CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE', // Lögmaður: Innsend gögn í dómssal
  CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE = 'CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE', // Réttargæslumaður: Innsend gögn í dómssal
  APPEAL_COURT_RECORD = 'APPEAL_COURT_RECORD',
  APPEAL_RULING = 'APPEAL_RULING',
  CIVIL_CLAIM = 'CIVIL_CLAIM',
  SENT_TO_PRISON_ADMIN_FILE = 'SENT_TO_PRISON_ADMIN_FILE',
  COURT_INDICTMENT_RULING_ORDER = 'COURT_INDICTMENT_RULING_ORDER', // dómari: úrskurðarskjal undir rekstri máls
}

// MD5 was used as file hashing algorithm until (TODO: add date) but was updated to SHA256 to avoid the probability
// of hash collision between files in our system. Since we still store MD5 alg types with each file hash
// in the db for historical purposes, we support both types here.
export enum HashAlgorithm {
  MD5 = 'MD5',
  SHA256 = 'SHA256',
}

export enum PoliceFileTypeCode {
  SUBPOENA = 'BRTNG',
  VERDICT = 'BRTNG_DOMUR',
}
