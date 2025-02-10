import {
  ApplicationTypes,
  FieldType,
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
  let attachments: ApplicationsAttachments[] = []
  if (application.attachments) {
    attachments = application.attachments.map((item) => ({
      // Note: will give all attachments in "Námsferill" the attachment key: "profskirteini",
      // since we have no way of knowing if it is CV or kynningabréf
      attachmentKey: AttachmentKey.profskirteini,
      url: item.fileUrl,
      fileName: item.fileName,
    }))
  }

  // Adding extraApplicationFields upload attachments to attachments object
  for (let i = 0; i < application.extraFieldList.length; i++) {
    const field = application.extraFieldList[i]
    if (field.fieldType === FieldType.UPLOAD) {
      const item = field.value as { fileName: string; fileUrl: string }
      attachments.push({
        attachmentKey:
          AttachmentKey[field.externalKey as keyof typeof AttachmentKey],
        url: item.fileUrl,
        fileName: item.fileName,
      })
    }
  }

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
      attachments: attachments,
      namskeid: undefined, // TODO what is this?
    },
  }

  return uglaApplication
}
