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
  DEFENDANT_APPEAL_DECLARATION = 'DEFENDANT_APPEAL_DECLARATION', // Verjandi: Áfrýjunaryfirlýsing til Landsréttar
  DEFENDANT_APPEAL_DECLARATION_CASE_FILE = 'DEFENDANT_APPEAL_DECLARATION_CASE_FILE', // Verjandi: Fylgigögn áfrýjunaryfirlýsingar
  INDEPENDENT_DEFENDANT_CASE_FILE = 'INDEPENDENT_DEFENDANT_CASE_FILE', // Varnaraðili: Innsend gögn í dómssal
  CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE = 'CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE', // Lögmaður: Innsend gögn í dómssal
  CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE = 'CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE', // Réttargæslumaður: Innsend gögn í dómssal
  APPEAL_COURT_RECORD = 'APPEAL_COURT_RECORD',
  APPEAL_RULING = 'APPEAL_RULING',
  CIVIL_CLAIM = 'CIVIL_CLAIM',
  SENT_TO_PRISON_ADMIN_FILE = 'SENT_TO_PRISON_ADMIN_FILE',
  COURT_INDICTMENT_RULING_ORDER = 'COURT_INDICTMENT_RULING_ORDER', // dómari: úrskurðarskjal undir rekstri máls
  DEFENDANT_RULING = 'DEFENDANT_RULING', // dómari: dómur (vísað frá eða niðurfelling) á einstakling
}

// Appeal files submitted by the parties (kærugögn) - as opposed to the court of
// appeals' own documents (APPEAL_RULING, APPEAL_COURT_RECORD)
export const partyAppealFileCategories = [
  CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
  CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
]

const isPartyAppealFileCategory = (category?: string | null): boolean =>
  Boolean(category) &&
  partyAppealFileCategories.includes(category as CaseFileCategory)

// The áfrýjunaryfirlýsing and whatever is filed alongside it. Deliberately not
// part of partyAppealFileCategories: those lock on the court of appeals' case
// number, and a declaration locks earlier - see isAppealFileDeletionLocked.
export const verdictAppealDeclarationFileCategories = [
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
  CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
]

const isVerdictAppealDeclarationCategory = (
  category?: string | null,
): boolean =>
  Boolean(category) &&
  verdictAppealDeclarationFileCategories.includes(category as CaseFileCategory)

// Kæra files are delivered to the court of appeals as soon as it registers its
// case number, so from that point on they can no longer be deleted.
//
// An áfrýjunaryfirlýsing locks earlier, and for a different reason: the
// declaration is the appeal itself, not a document filed in support of one, and
// it is filed long before Landsréttur has a case number to register. Taking it
// back means withdrawing the appeal.
export const isAppealFileDeletionLocked = (
  category?: string | null,
  appealCase?: { appealCaseNumber?: string | null } | null,
): boolean => {
  if (!appealCase) {
    return false
  }

  if (isVerdictAppealDeclarationCategory(category)) {
    return true
  }

  return isPartyAppealFileCategory(category) && Boolean(appealCase.appealCaseNumber)
}

// A ruling order pronounced during the course of a case is usually delivered
// orally in the court session, and only written up as a document if a party
// appeals it. Such a ruling exists as a case file from the moment it is
// pronounced - the court record links to it, and the parties' appeal decisions
// and any appeal are keyed on it - but nothing is stored in S3 for it until the
// district court writes the ruling up and uploads it.
//
// isPronouncedOrally records how the ruling was delivered and stays true after
// the document has been uploaded, so it is the empty S3 key that says the
// document is still missing.
export const isRulingOrderWithoutDocument = (file: {
  category?: CaseFileCategory | null
  isPronouncedOrally?: boolean | null
  key?: string | null
}): boolean =>
  file.category === CaseFileCategory.COURT_INDICTMENT_RULING_ORDER &&
  Boolean(file.isPronouncedOrally) &&
  !file.key

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
