import { ApplicationTypes, IApplication } from '@island.is/university-gateway'
import { ApplicationsPostRequest } from '../../../gen/fetch'

export const mapUglaApplication = (
  application: IApplication,
  logError: (courseExternalId: string, error: Error) => void,
): ApplicationsPostRequest => {
  const uglaApplication: ApplicationsPostRequest = {
    inlineObject: {
      guid: application.id,
      kennitala: '0101302989',
      // .replace('**', ''), //**REMOVE_PII: 0101302989**

      simi: application.applicant.phone,

      namsleid: application.programExternalId,

      tegundUmsoknar: 0, // TODO what is this?

      namsform: application.modeOfDelivery, // TODO is this right?

      nominationId: 0, // TODO what is this?

      undanthaga:
        application.educationOption === ApplicationTypes.EXEMPTION
          ? 'true'
          : 'false', // TODO connect to choice in application

      leidbeiningarFylgigognLesid: 'false', // TODO done when extraApplicationFields are connected

      inntokuskilyrdiLesin: 'false', // TODO done when extraApplicationFields are connected

      // kjorsvid: und, // TODO connect to chosen kjorsvid

      personuverndSamthykki: 'false', // TODO done when extraApplicationFields are connected
      hugverkaretturSamthykki: 'false', // TODO done when extraApplicationFields are connected
      eldriUmsokn: 'false', // TODO should we return this?
      skilyrdiMsl: 'false', // TODO should we return this?
      personuverndMslLesin: 'false', // TODO done when extraApplicationFields are connected
      samthykkiCreditinfo: 'false', // TODO done when extraApplicationFields are connected
      samthykkiTrunadarlaeknir: 'false', // TODO done when extraApplicationFields are connected
      samthykkiSakaskra: 'false', // TODO done when extraApplicationFields are connected
      samthykkiOkurettindaskra: 'false', // TODO done when extraApplicationFields are connected
      framhaldsskolar: [],
      fyrraNam: application.educationList.map((education) => {
        return {
          skoli: education.schoolName,
          namsgrada: education.degree,
          land: education.degreeCountry,
          namiLokid: education.degreeEndDate,
        }
      }),
      medmaelendur: [], // TODO are we doing this?
      leidbeinandi: undefined, // TODO are we doing this?
      tenglar: [], // TODO are we doing this?
      skrar: undefined, // TODO connect files later
      namskeid: undefined, // TODO what is this?
    },
  }
  return uglaApplication
}
