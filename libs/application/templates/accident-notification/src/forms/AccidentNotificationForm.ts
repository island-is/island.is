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
  buildDateField,
  buildDescriptionField,
  buildCheckboxField,
} from '@island.is/application/core'
//replace
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import {
  AccidentTypeEnum,
  DataProviderTypes,
  WhoIsTheNotificationForEnum,
  AttachmentsEnum,
} from '../types'
import {
  externalData,
  application,
  hindrances,
  applicantInformation,
  whoIsTheNotificationFor,
  accidentDetails,
  accidentType,
  companyInfo,
  workMachine,
  locationAndPurpose,
} from '../lib/messages'
import { NO, YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import { attachments } from '../lib/messages/attachments'

export const AccidentNotificationForm: Form = buildForm({
  id: 'AccidentNotificationForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'AccidentNotificationForm',
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
          id: 'AccidentNotificationForm',
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
      id: 'informationAboutApplicantSection',
      title: applicantInformation.general.title,
      children: [
        buildMultiField({
          id: 'applicant',
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
      id: 'accidentType.section',
      title: accidentType.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'accidentType.section',
          title: accidentType.general.heading,
          description: accidentType.general.description,
          children: [
            buildRadioField({
              id: 'accidentType.radioButton',
              width: 'half',
              title: '',
              options: [
                {
                  value: AccidentTypeEnum.HOMEACTIVITIES,
                  label: accidentType.labels.homeActivites,
                },
                {
                  value: AccidentTypeEnum.WORK,
                  label: accidentType.labels.work,
                },
                {
                  value: AccidentTypeEnum.RESCUEWORK,
                  label: accidentType.labels.rescueWork,
                },
                {
                  value: AccidentTypeEnum.STUDIES,
                  label: accidentType.labels.studies,
                },
                {
                  value: AccidentTypeEnum.SPORTS,
                  label: accidentType.labels.sports,
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
      id: 'accidentDetails.section',
      title: accidentDetails.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'accidentDetails',
          title: accidentDetails.general.sectionTitle,
          description: accidentDetails.general.description,
          children: [
            buildDateField({
              id: 'accidentDetails.dateOfAccident',
              title: accidentDetails.labels.date,
              placeholder: accidentDetails.placeholder.date,
              backgroundColor: 'blue',
              width: 'half',
            }),
            buildTextField({
              id: 'accidentDetails.timeOfAccident',
              title: accidentDetails.labels.time,
              placeholder: accidentDetails.placeholder.time,
              backgroundColor: 'blue',
              width: 'half',
              format: '##:##',
            }),
            buildTextField({
              id: 'accidentDetails.descriptionOfAccident',
              title: accidentDetails.labels.description,
              placeholder: accidentDetails.placeholder.description,
              backgroundColor: 'blue',
              rows: 10,
              variant: 'textarea',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      title: companyInfo.general.title,
      children: [
        buildMultiField({
          title: companyInfo.general.title,
          description: companyInfo.general.description,
          children: [
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: companyInfo.labels.nationalId,
              backgroundColor: 'blue',
              variant: 'textarea',
              required: true,
            }),
            buildCheckboxField({
              id: 'companyInfo.isRepresentativeOfCompany',
              title: '',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: companyInfo.labels.checkBox,
                },
              ],
            }),
            buildDescriptionField({
              id: 'companyInfo.descriptionField',
              description: '',
              space: 'containerGutter',
              titleVariant: 'h5',
              title: companyInfo.labels.descriptionField,
              condition: (formValue) => {
                return formValue.isRepresentativeOfCompany?.toString() === YES
              },
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'companyInfo.name',
              title: companyInfo.labels.name,
              backgroundColor: 'blue',
              condition: (formValue) => {
                console.log(formValue.isRepresentativeOfCompany)
                return formValue.isRepresentativeOfCompany?.toString() === YES
              },
            }),
            buildTextField({
              id: 'companyInfo.email',
              title: companyInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) => {
                return formValue.isRepresentativeOfCompany?.toString() === YES
              },
            }),
            buildTextField({
              id: 'companyInfo.phoneNumber',
              title: companyInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) => {
                return formValue.isRepresentativeOfCompany?.toString() === YES
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'workMachine.section',
      title: workMachine.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'workMachine',
          title: workMachine.general.workMachineRadioTitle,
          description: '',
          children: [
            buildRadioField({
              id: 'workMachineRadio',
              title: '',
              backgroundColor: 'blue',
              defaultValue: NO,
              width: 'half',
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'workMachine.subSection',
          title: workMachine.general.subSectionTitle,
          condition: (formValue) => formValue.workMachineRadio === YES,
          children: [
            buildMultiField({
              title: workMachine.general.subSectionTitle,
              children: [
                buildTextField({
                  id: 'workMachine.registrationNumber',
                  title: workMachine.labels.registrationNumber,
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'workMachine.desriptionOfMachine',
                  title: workMachine.labels.desriptionOfMachine,
                  placeholder: workMachine.placeholder.desriptionOfMachine,
                  backgroundColor: 'blue',
                  rows: 4,
                  variant: 'textarea',
                  required: true,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      title: locationAndPurpose.general.title,
      children: [
        buildMultiField({
          title: locationAndPurpose.general.title,
          description: locationAndPurpose.general.description,
          children: [
            buildTextField({
              id: 'locationAndPurpose.location',
              title: locationAndPurpose.labels.location,
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'locationAndPurpose.postalCode',
              title: locationAndPurpose.labels.postalCode,
              backgroundColor: 'blue',
              width: 'half',
            }),
            buildTextField({
              id: 'locationAndPurpose.city',
              title: locationAndPurpose.labels.city,
              backgroundColor: 'blue',
              width: 'half',
            }),
            buildTextField({
              id: 'locationAndPurpose.purpose',
              title: locationAndPurpose.labels.purpose,
              backgroundColor: 'blue',
              rows: 6,
              variant: 'textarea',
            }),
          ],
        }),
      ],
    }),
    // TODO remove before release, just there to continue with last screen
    buildDescriptionField({
      id: '',
      description: '',
      title: '',
    }),
  ],
})
