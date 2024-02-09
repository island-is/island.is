import { IApplication } from '@island.is/university-gateway'
import { ApplicationsPostRequest } from '../../../gen/fetch'

export const mapUglaApplication = (
  application: IApplication,
  logError: (courseExternalId: string, error: Error) => void,
): ApplicationsPostRequest => {
  const uglaApplication: ApplicationsPostRequest = {
    inlineObject: {
      guid: application.id,
      kennitala: application.applicant.nationalId,

      simi: application.applicant.phone,

      namsleid: application.programExternalId,

      tegundUmsoknar: 0, // TODO what is this?

      namsform: application.modeOfDelivery, // TODO is this right?

      nominationId: 0, // TODO what is this?

      undanthaga: 'false', // TODO connect to choice in application

      leidbeiningarFylgigognLesid: 'false', // TODO done when extraApplicationFields are connected

      inntokuskilyrdiLesin: 'false', // TODO done when extraApplicationFields are connected

      kjorsvid: 'TODO', // TODO connect to chosen kjorsvid

      personuverndSamthykki: 'false', // TODO done when extraApplicationFields are connected
      hugverkaretturSamthykki: 'false', // TODO done when extraApplicationFields are connected
      eldriUmsokn: 'false', // TODO should we return this?
      skilyrdiMsl: 'false', // TODO should we return this?
      personuverndMslLesin: 'false', // TODO done when extraApplicationFields are connected
      samthykkiCreditinfo: 'false', // TODO done when extraApplicationFields are connected
      samthykkiTrunadarlaeknir: 'false', // TODO done when extraApplicationFields are connected
      samthykkiSakaskra: 'false', // TODO done when extraApplicationFields are connected
      samthykkiOkurettindaskra: 'false', // TODO done when extraApplicationFields are connected
      framhaldsskolar: application.educationList.map((education) => {
        return {
          framhaldsskoliNafn: education.schoolName,
          framhaldsskoliLand: 'TODO',
        }
      }),
      fyrraNam: [], // TODO við gerum ekki greinamun í educationList á framhaldsskóla námi og öðru námi.. hvernig höndlum við þetta?
      medmaelendur: [], // TODO are we doing this?
      leidbeinandi: undefined, // TODO are we doing this?
      tenglar: [], // TODO are we doing this?
      skrar: undefined, // TODO connect files later
      namskeid: undefined, // TODO what is this?
    },
  }
  return uglaApplication
}
