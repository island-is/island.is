import {
  ApplicationTypes,
  IApplication,
  IApplicationAttachment,
} from '@island.is/university-gateway'
import {
  ApplicationsAttachments,
  ApplicationsPostRequest,
  AttachmentKey,
} from '../../../gen/fetch'

export const mapUglaApplication = async (
  application: IApplication,
  logError: (error: Error) => void,
): Promise<ApplicationsPostRequest> => {
  const uglaApplication: ApplicationsPostRequest = {
    inlineObject: {
      guid: application.id,
      kennitala: application.applicant.nationalId,

      simi: application.applicant.phone,

      namsleid: application.programExternalId,

      tegundUmsoknar: 0, // TODO what is this?

      namsform: application.modeOfDelivery, // TODO is this right?

      nominationId: 0, // TODO what is this?

      undanthaga:
        application.educationOption === ApplicationTypes.EXEMPTION
          ? 'true'
          : 'false',

      leidbeiningarFylgigognLesid: 'false', // TODO done when extraApplicationFields are connected

      inntokuskilyrdiLesin: 'false', // TODO done when extraApplicationFields are connected

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
      attachments: application.attachments
        ? await mapApplicationAttachments(application.attachments)
        : undefined,
      namskeid: undefined, // TODO what is this?
    },
  }

  return uglaApplication
}

const mapApplicationAttachments = async (
  attachments: Array<IApplicationAttachment | undefined>,
): Promise<Array<ApplicationsAttachments>> => {
  return await Promise.all(
    attachments.filter(Boolean).map(async (attachment) => {
      return {
        url: attachment?.url,
        attachmentKey:
          AttachmentKey[attachment?.fileType as keyof typeof AttachmentKey],
        fileName: attachment?.fileName,
      } as ApplicationsAttachments
    }),
  )
}
