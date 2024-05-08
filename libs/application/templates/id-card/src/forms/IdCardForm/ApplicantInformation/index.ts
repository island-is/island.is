import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { IdentityDocumentChild, Routes } from '../../../lib/constants'
import { applicantInformation } from '../../../lib/messages'
import {
  Application,
  NationalRegistryIndividual,
  UserProfile,
} from '@island.is/application/types'
import { getChosenApplicant } from '../../../utils'

export const ApplicanInformationSubSection = buildSection({
  id: Routes.APPLICANTSINFORMATION,
  title: applicantInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.APPLICANTSINFORMATION,
      title: applicantInformation.general.sectionTitle,
      description: applicantInformation.general.sectionDescription,
      children: [
        buildDescriptionField({
          id: `${Routes.APPLICANTSINFORMATION}.title`,
          title: applicantInformation.labels.applicant,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: `${Routes.APPLICANTSINFORMATION}.applicantName`,
          title: applicantInformation.labels.applicantName,
          width: 'half',
          defaultValue: (application: Application) => {
            const chosenApplicant = getChosenApplicant(application)

            return chosenApplicant.name
          },
        }),
        buildTextField({
          id: `${Routes.APPLICANTSINFORMATION}.applicantNationalId`,
          title: applicantInformation.labels.applicantNationalId,
          width: 'half',
          defaultValue: (application: Application) => {
            const chosenApplicant = getChosenApplicant(application)

            return chosenApplicant.nationalId
          },
        }),
        buildTextField({
          id: `${Routes.APPLICANTSINFORMATION}.applicantEmail`,
          title: applicantInformation.labels.applicantEmail,
          width: 'half',
          defaultValue: (application: Application) => {
            const applicantIdentity = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const applicantUserProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            const chosenApplicantNationalId = getValueViaPath(
              application.answers,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            if (applicantIdentity?.nationalId === chosenApplicantNationalId) {
              return applicantUserProfile?.email
            }
            return ''
          },
        }),
        buildTextField({
          id: `${Routes.APPLICANTSINFORMATION}.applicantPhoneNumber`,
          title: applicantInformation.labels.applicantPhoneNumber,
          width: 'half',
          defaultValue: (application: Application) => {
            const applicantIdentity = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const applicantUserProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            const chosenApplicantNationalId = getValueViaPath(
              application.answers,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            if (applicantIdentity?.nationalId === chosenApplicantNationalId) {
              return applicantUserProfile?.mobilePhoneNumber
            }

            return ''
          },
        }),
      ],
    }),
  ],
})
