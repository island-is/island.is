import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  buildFileUploadField,
  buildDescriptionField,
} from '@island.is/application/core'
//replace
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import {
  AttachmentsEnum,
  DataProviderTypes,
  WhoIsTheNotificationForEnum,
  WorkInjuryTypeEnum,
} from '../types'
import {
  externalData,
  application,
  hindrances,
  applicantInformation,
  whoIsTheNotificationFor,
} from '../lib/messages'
import { NO, YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import { attachments } from '../lib/messages/attachments'
import { workInjuryType } from '../lib/messages/workInjuryType'

export const InformationAndDataProviderForm: Form = buildForm({
  id: 'InformationAndDataProviderForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'informationAndDataProviderForm',
      title: externalData.agreementDescription.sectionTitle,
      children: [
        buildMultiField({
          title: externalData.agreementDescription.sectionTitle,
          id: 'agreementDescriptionMultiField',
          children: [
            buildCustomField({
              id: 'agreementDescriptionCustomField',
              title: '',
              component: 'AgreementDescription',
            }),
          ],
        }),
        buildSubSection({
          id: 'informationAndDataProviderForm',
          title: externalData.dataProvider.sectionTitle,
          children: [
            buildExternalDataProvider({
              title: externalData.dataProvider.pageTitle,
              id: 'approveExternalData',
              subTitle: externalData.dataProvider.subTitle,
              description: '',
              checkboxLabel: externalData.dataProvider.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: DataProviderTypes.NationalRegistry,
                  title: externalData.nationalRegistry.title,
                  subTitle: externalData.nationalRegistry.description,
                }),
                buildDataProviderItem({
                  id: 'userProfile',
                  type: DataProviderTypes.UserProfile,
                  title: externalData.userProfile.title,
                  subTitle: externalData.userProfile.description,
                }),
                buildDataProviderItem({
                  id: 'revAndCustoms',
                  type: '',
                  title: externalData.revAndCustoms.title,
                  subTitle: externalData.revAndCustoms.description,
                }),
                buildDataProviderItem({
                  id: 'notifications',
                  type: '',
                  title: externalData.notifications.title,
                  subTitle: externalData.notifications.description,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'hindrances',
      title: hindrances.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'timePassedHindrancesMultiField',
          title: '',
          children: [
            buildRadioField({
              id: 'timePassedHindrance',
              defaultValue: NO,
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
              title: hindrances.timePassedHindrance.radioFieldTitle,
              width: 'half',
              largeButtons: true,
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'timePassedHindranceFielAlertMessage',
              title: hindrances.timePassedHindrance.errorTitle,
              description: hindrances.timePassedHindrance.errorDescription,
              condition: (formValue) => formValue.timePassedHindrance === YES,
            }),
          ],
        }),
        buildMultiField({
          id: 'carHindrancesMultiField',
          title: '',
          children: [
            buildRadioField({
              id: 'carAccidentHindrance',
              defaultValue: NO,
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
              title: hindrances.carAccident.radioFieldTitle,
              width: 'half',
              largeButtons: true,
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'carAccidentHindranceFielAlertMessage',
              title: hindrances.carAccident.errorTitle,
              description: hindrances.carAccident.errorDescription,
              condition: (formValue) => formValue.carAccidentHindrance === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'informationAboutApplicant',
      title: applicantInformation.general.title,
      children: [
        buildMultiField({
          id: 'applicantSection',
          title: applicantInformation.general.title,
          description: applicantInformation.general.description,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: applicantInformation.labels.name,
              backgroundColor: 'blue',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.fullName,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: applicantInformation.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.nationalId,
            }),
            buildTextField({
              id: 'applicant.address',
              title: applicantInformation.labels.address,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.address
                  ?.streetAddress,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: applicantInformation.labels.postalCode,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) => {
                console.log(application.externalData)
                return application.externalData?.nationalRegistry?.data?.address
                  ?.postalCode
              },
            }),
            buildTextField({
              id: 'applicant.city',
              title: applicantInformation.labels.city,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.address?.city,
            }),
            buildTextField({
              id: 'applicant.email',
              title: applicantInformation.labels.email,
              width: 'half',
              variant: 'email',
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.userProfile?.data?.email,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: applicantInformation.labels.tel,
              format: '###-####',
              width: 'half',
              variant: 'tel',
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.userProfile?.data?.mobilePhoneNumber,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'whoIsTheNotificationFor.section',
      title: whoIsTheNotificationFor.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'whoIsTheNotificationFor',
          title: whoIsTheNotificationFor.general.heading,
          description: whoIsTheNotificationFor.general.description,
          children: [
            buildRadioField({
              id: 'whoIsTheNotificationFor.answer',
              title: '',
              options: [
                {
                  value: WhoIsTheNotificationForEnum.ME,
                  label: whoIsTheNotificationFor.labels.me,
                },
                {
                  value: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
                  label: whoIsTheNotificationFor.labels.powerOfAttorney,
                },
                {
                  value: WhoIsTheNotificationForEnum.JURIDICALPERSON,
                  label: whoIsTheNotificationFor.labels.juridicalPerson,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'attachments.section',
      title: attachments.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'attachments',
          title: attachments.general.heading,
          children: [
            buildRadioField({
              id: 'attachments.injuryCertificate',
              title: '',
              description: attachments.general.description,
              options: [
                {
                  value: AttachmentsEnum.INJURYCERTIFICATE,
                  label: attachments.labels.injuryCertificate,
                },
                {
                  value: AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
                  label: attachments.labels.hospitalSendsCertificate,
                },
                {
                  value: AttachmentsEnum.SENDCERTIFICATELATER,
                  label: attachments.labels.sendCertificateLater,
                },
              ],
            }),
            buildCustomField(
              {
                id: 'attachments.injuryCertificate.alert',
                title: attachments.labels.alertMessage,
                description: attachments.general.alertMessage,
                component: 'FieldAlertMessage',
                condition: (formValue) =>
                  (formValue as {
                    attachments: { injuryCertificate: AttachmentsEnum }
                  }).attachments?.injuryCertificate ===
                  AttachmentsEnum.SENDCERTIFICATELATER,
              },
              { type: 'warning' },
            ),
          ],
        }),
        buildSubSection({
          id: 'attachments.injuryCertificateFile.section',
          title: attachments.general.uploadTitle,
          children: [
            buildFileUploadField({
              id: 'attachments.injuryCertificateFile',
              title: attachments.general.uploadHeader,
              uploadHeader: attachments.general.uploadHeader,
              uploadDescription: attachments.general.uploadDescription,
              uploadButtonLabel: attachments.general.uploadButtonLabel,
              introduction: attachments.general.uploadIntroduction,
            }),
          ],
          condition: (formValue) =>
            (formValue as {
              attachments: { injuryCertificate: AttachmentsEnum }
            }).attachments?.injuryCertificate ===
            AttachmentsEnum.INJURYCERTIFICATE,
        }),
      ],
    }),
    buildSection({
      id: 'workInjury.section',
      title: workInjuryType.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'workInjury',
          title: workInjuryType.general.sectionTitle,
          description: workInjuryType.general.description,
          children: [
            buildRadioField({
              id: 'workInjury.radioButtons',
              width: 'half',
              title: '',
              options: [
                {
                  value: WorkInjuryTypeEnum.GENERAL,
                  label: workInjuryType.labels.general,
                },
                {
                  value: WorkInjuryTypeEnum.FISHERMAN,
                  label: workInjuryType.labels.fisherman,
                },
                {
                  value: WorkInjuryTypeEnum.ATHLETE,
                  label: workInjuryType.labels.athlete,
                },
                {
                  value: WorkInjuryTypeEnum.FARMER,
                  label: workInjuryType.labels.farmer,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
