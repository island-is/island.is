export const apiConstants = {
  actualDateOfBirth: 'date_of_birth',
  actualDateOfBirthMonths: 'date_of_birth_months',
  pensionFunds: {
    // Id used when applicant does not wish to pay into a private pension fund
    noPrivatePensionFundId: 'X000',
    noPensionFundId: 'L000',
  },
  unions: {
    noUnion: 'F000',
  },
  rights: {
    // When primary or secondary parents are requested extra days from their spouse
    receivingRightsId: 'FSAL-GR',
    multipleBirthsOrlofRightsId: 'ORLOF-FBF',
    multipleBirthsGrantRightsId: 'ST-FBF',
    artificialInseminationRightsId: 'EITTFOR',
  },
  attachments: {
    selfEmployed: 'selfEmployed',
    student: 'Student',
    unEmploymentBenefits: 'UnemploymentBenefits',
    other: 'Other',
    artificialInsemination: 'ArtificialInsemination',
    parentWithoutBirthParent: 'ParentWithoutBirthParent',
    permanentFosterCare: 'PermanentFosterCare',
    adoption: 'Adoption',
    residenceGrant: 'ResidenceGrant',
    employmentTerminationCertificate: 'EmploymentTerminationCertificate',
    changeEmployer: 'ChangeEmployer',
  },
}

export const isRunningInProduction = process.env.NODE_ENV === 'production'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'
export const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60
export const df = 'yyyy-MM-dd'

export const rightsDescriptions: { [key: string]: string } = {
  ALVEIKT: 'Alv.veikt barn eftir heimk.',
  'ANDL.MEÐG': 'Andlát hins foreldris á meðgöngu',
  ANDLÁT: 'Andlát maka',
  ANDVANA18: 'Fósturlát eftir 18 vikur',
  ANDVANA22: 'Andvana fætt eftir 22 vikur',
  'DVAL.FJÖL': 'Dvalarstyrkur, fjölburafæðing',
  DVALSTYRK: 'Dvalarstyrkur',
  EITTFOR: 'Eitt foreldri',
  'F-ANDV22': 'Andvana fætt eftir 22 vikur - faðir',
  FANGELSI: 'Fangelsisvist',
  'F-FL-FS': 'Fæðingarst. forsjárlauss föður',
  'F-FL-FSN': 'Fæðst. forsl.föður í námi',
  'F-FL-L-GR': 'Gr.rétt. fors.lauss föður laun',
  'F-FL-L-GRS': 'Gr.rétt. fors.lauss föður laun/sjálfst.',
  'F-FL-S-GR': 'Gr.rétt. fors.lauss föður Sjál',
  'F-FÓ-FS': 'Fæðingastyrkur fósturföðurs',
  'F-FÓ-FSN': 'Fæðingastyrkur fósturf. í námi',
  'F-FÓ-GR': 'Grunnréttur fósturföðurs',
  'F-FÓ-GR-SJ': 'Grunnréttur fósturföðurs launþ/sjálfst.',
  'F-FÓ-S-GR': 'Grunnr.fósturföðurs sjálfst.',
  'F-FS': 'Fæðingastyrkur föður',
  'F-FSN': 'Fæðingarstyrkur föður í námi',
  'F-L-GR': 'Grunnréttur föður launþ.',
  'F-L-GR-SJ': 'Grunnréttur föður launþ./sjálfst.',
  'FO-ANDV22': 'Andvana fætt eftir 22 vikur - foreldri',
  'FO-FL-FS': 'Fæðingarst. forsjárlauss foreldris',
  'FO-FL-FSN': 'Fæðst. forsl.foreldris í námi',
  'FO-FL-L-GR': 'Gr.rétt. fors.lauss foreldris laun',
  'FO-FL-L-GS': 'Gr.rétt. fors.lauss foreldris laun/sjálfst.',
  'FO-FL-S-GR': 'Gr.rétt. fors.lauss foreldris Sjál',
  'FO-FÓ-FS': 'Fæðingastyrkur fósturforeldris',
  'FO-FÓ-FSN': 'Fæðingastyrkur fósturforeldris í námi',
  'FO-FÓ-GR': 'Grunnréttur fósturforeldris',
  'FO-FÓ-GR-S': 'Grunnréttur fósturforeldris launþ/sjálfst.',
  'FO-FÓ-S-GR': 'Grunnr.fósturforeldris sjálfst.',
  'FO-FS': 'Fæðingastyrkur foreldris',
  'FO-FSN': 'Fæðingarstyrkur foreldris í námi',
  'FO-L-GR': 'Grunnréttur foreldris launþ.',
  'FO-L-GR-SJ': 'Grunnréttur foreldris launþ./sjálfst.',
  'FO-S-GR': 'Grunnréttur foreldris sjálfst.',
  'FO-Æ-FS': 'Fæðingarstyrkur foreldris ættleið.',
  'FO-Æ-FSN': 'Fæðingarst. foreldris í námi ættl.',
  'FO-Æ-L-GR': 'Grunnréttur foreldris ættleiðing',
  'FO-Æ-L-GRS': 'Grunnréttur foreldris ættleiðing launþ/sjálfst.',
  'FO-Æ-S-GR': 'Grunnr. foreldris ættl. sjálfst.',
  'FSAL-GR': 'Framsal grunnréttur',
  'F-S-GR': 'Grunnréttur föður sjálfst.',
  'F-Æ-FS': 'Fæðingarstyrkur föður ættleið.',
  'F-Æ-FSN': 'Fæðingarst. föður í námi ættl.',
  'F-Æ-L-GR': 'Grunnréttur föður ættleiðing',
  'F-Æ-L-GRSJ': 'Grunnréttur föður ættleiðing launþ/sjálfst.',
  'F-Æ-S-GR': 'Grunnr. föður ættl. sjálfst.',
  'M-ANDV22': 'Andvana fætt eftir 22 vikur - móðir',
  'M-FL-FS': 'Fæðingarst. forsjárl. móður',
  'M-FL-FSN': 'Fæðst. forsl. móður í námi',
  'M-FL-L-GR': 'Grunnr. forsjárl. móður launþ.',
  'M-FL-L-GRS': 'Grunnr. forsjárl. móður launþ./sjálfst.',
  'M-FL-S-GR': 'Grunnr. forsjárl. móður sjálfs',
  'M-FÓ-FS': 'Fæðingarstyrkur fósturmóður',
  'M-FÓ-FSN': 'Fæðingarst. fósturmóður í námi',
  'M-FÓ-L-GR': 'Grunnréttur fósturmóður',
  'M-FÓ-L-GRS': 'Grunnréttur fósturmóður launþ/sjálfst.',
  'M-FÓ-S-GR': 'Grunnréttur fósturmóður sjálfs',
  'M-FS': 'Fæðingastyrkur móður',
  'M-FSN': 'Fæðingarstyrkur móður í námi',
  'M-L-GR': 'Grunnréttur móður',
  'M-L-GR-SJ': 'Grunnréttur móður launaþ./sjálfst.',
  'M-S-GR': 'Grunnréttur móður sjálfst.',
  'M-Æ-FS': 'Fæðingarstyrkur móður ættleið.',
  'M-Æ-FSN': 'Fæðingarst. móður í námi ættl.',
  'M-Æ-L-GR': 'Grunnr.móður ættleiðing',
  'M-Æ-L-GRSJ': 'Grunnr.móður ættleiðing launþ./sjálfst.',
  'M-Æ-S-GR': 'Grunnr.móður ættleiðing',
  'NÁLG.BANN': 'Nálgunarbann',
  'ORLOF-FBF': 'Fjölburafæðing (orlof)',
  'ORLOF-FBVF': 'Fjölfóstur (orlof)',
  'ORLOF-FBÆ': 'Fjölættleiðing (orlof)',
  ÓFEÐRAÐ: 'Ófeðrað barn',
  RÉTTLAUST: 'Réttindaleysi hins foreldris',
  'SAM-GR': 'Sameiginlegur grunnréttur',
  'SJÚK/SLYS': 'Sjúkdómar og slys',
  'ST-FBF': 'Fjölburafæðing (styrkur)',
  UMGENGNI: 'Framlenging v/takm eða engrar umg forsjárl. foreld',
  VEIKBARN: 'Veikindi barns',
  VEIKFÆÐING: 'Veikindi móður v/fæðingar',
  VEIKMEÐG: 'Veikindi móður á meðgöngu',
  VEIKTBARN7: 'Alvar.veikindi barns f. heimk.',
  'ÆTTL.STYRK': 'Ættleiðingarstyrkur',
  'ÖRYGGI-L': 'Leng. M vegna öryggisást.',
}
