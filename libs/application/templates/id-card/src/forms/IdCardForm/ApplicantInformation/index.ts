import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
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
import {
  getChosenApplicant,
  hasSecondGuardian,
  getChildPassport,
} from '../../../utils'
import {} from '../../../utils/hasSecondGuardian'

export const ApplicanInformationSubSection = buildSection({
  id: Routes.APPLICANTSINFORMATION,
  title: applicantInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.APPLICANTSINFORMATION,
      title: applicantInformation.general.sectionTitle,
      description: applicantInformation.general.sectionDescription,
      children: [
        /*** APPLICANT ***/
        buildDescriptionField({
          id: `${Routes.APPLICANTSINFORMATION}.title`,
          title: applicantInformation.labels.applicant,
          titleVariant: 'h5',
          marginTop: 2,
          marginBottom: 0,
        }),
        buildTextField({
          id: `${Routes.APPLICANTSINFORMATION}.name`,
          title: applicantInformation.labels.applicantName,
          readOnly: true,
          width: 'half',
          defaultValue: (application: Application) => {
            const chosenApplicant = getChosenApplicant(application)

            return chosenApplicant.name
          },
        }),
        buildTextField({
          id: `${Routes.APPLICANTSINFORMATION}.nationalId`,
          title: applicantInformation.labels.applicantNationalId,
          readOnly: true,
          width: 'half',
          format: '######-####',
          defaultValue: (application: Application) => {
            const chosenApplicant = getChosenApplicant(application)

            return chosenApplicant.nationalId
          },
        }),
        buildTextField({
          id: `${Routes.APPLICANTSINFORMATION}.email`,
          title: applicantInformation.labels.applicantEmail,
          width: 'half',
          condition: (formValue, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return applicantIdentity?.nationalId === chosenApplicantNationalId
          },
          defaultValue: (application: Application) => {
            const applicantUserProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            return applicantUserProfile?.email
          },
        }),
        buildPhoneField({
          id: `${Routes.APPLICANTSINFORMATION}.phoneNumber`,
          title: applicantInformation.labels.applicantPhoneNumber,
          width: 'half',
          condition: (formValue, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return applicantIdentity?.nationalId === chosenApplicantNationalId
          },
          defaultValue: (application: Application) => {
            const applicantUserProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            return applicantUserProfile?.mobilePhoneNumber
          },
        }),

        /*** FIRST GUARDIAN ***/
        buildDescriptionField({
          id: `${Routes.FIRSTGUARDIANINFORMATION}.title`,
          title: applicantInformation.labels.parent,
          titleVariant: 'h5',
          marginTop: 5,
          marginBottom: 0,
          condition: (formValue, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return applicantIdentity?.nationalId !== chosenApplicantNationalId
          },
        }),
        buildTextField({
          id: `${Routes.FIRSTGUARDIANINFORMATION}.name`,
          title: applicantInformation.labels.name,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const applicantIdentity = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return applicantIdentity?.fullName
          },
          condition: (formValue, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return applicantIdentity?.nationalId !== chosenApplicantNationalId
          },
        }),
        buildTextField({
          id: `${Routes.FIRSTGUARDIANINFORMATION}.nationalId`,
          title: applicantInformation.labels.nationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const applicantIdentity = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return applicantIdentity?.nationalId
          },
          condition: (formValue, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return applicantIdentity?.nationalId !== chosenApplicantNationalId
          },
        }),
        buildTextField({
          id: `${Routes.FIRSTGUARDIANINFORMATION}.email`,
          title: applicantInformation.labels.applicantEmail,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const applicantUserProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            return applicantUserProfile?.email
          },
          condition: (formValue, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return applicantIdentity?.nationalId !== chosenApplicantNationalId
          },
        }),
        buildPhoneField({
          id: `${Routes.FIRSTGUARDIANINFORMATION}.phoneNumber`,
          title: applicantInformation.labels.applicantPhoneNumber,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const applicantUserProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            return applicantUserProfile?.mobilePhoneNumber
          },
          condition: (formValue, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return applicantIdentity?.nationalId !== chosenApplicantNationalId
          },
        }),

        /*** SECOND GUARDIAN ***/
        buildDescriptionField({
          id: `${Routes.SECONDGUARDIANINFORMATION}.title`,
          title: applicantInformation.labels.parent,
          titleVariant: 'h5',
          marginTop: 5,
          marginBottom: 0,
          condition: (answers, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              answers,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return (
              applicantIdentity?.nationalId !== chosenApplicantNationalId &&
              hasSecondGuardian(answers, externalData)
            )
          },
        }),
        buildTextField({
          id: `${Routes.SECONDGUARDIANINFORMATION}.name`,
          title: applicantInformation.labels.name,
          readOnly: true,
          width: 'half',
          condition: (answers, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              answers,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return (
              applicantIdentity?.nationalId !== chosenApplicantNationalId &&
              hasSecondGuardian(answers, externalData)
            )
          },
          defaultValue: ({ answers, externalData }: Application) => {
            const child = getChildPassport(answers, externalData)
            return child?.secondParentName ?? ''
          },
        }),
        buildTextField({
          id: `${Routes.SECONDGUARDIANINFORMATION}.nationalId`,
          title: applicantInformation.labels.nationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answers, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              answers,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return (
              applicantIdentity?.nationalId !== chosenApplicantNationalId &&
              hasSecondGuardian(answers, externalData)
            )
          },
          defaultValue: ({ answers, externalData }: Application) => {
            const child = getChildPassport(answers, externalData)
            return child?.secondParent ?? ''
          },
        }),
        buildCustomField({
          id: `${Routes.SECONDGUARDIANINFORMATION}`,
          component: 'SecondGuardianEmailAndPhone',
          title: '',
          condition: (answers, externalData) => {
            const applicantIdentity = getValueViaPath(
              externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            const chosenApplicantNationalId = getValueViaPath(
              answers,
              Routes.CHOSENAPPLICANTS,
              '',
            ) as string

            return (
              applicantIdentity?.nationalId !== chosenApplicantNationalId &&
              hasSecondGuardian(answers, externalData)
            )
          },
        }),
      ],
    }),
  ],
})
