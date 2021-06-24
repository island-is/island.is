import {
  Application,
  buildCustomField,
  buildDataProviderItem,
  buildDateField,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import {
  complainedFor,
  complainee,
  complaintDescription,
  complaintInformation,
  dataProvider,
  information,
  section,
} from '../lib/messages'
import {
  ComplaineeTypes,
  OmbudsmanComplaintTypeEnum,
} from '../shared/constants'
import { getComplaintType, isGovernmentComplainee } from '../utils'

export const ComplaintsToAlthingiOmbudsmanApplication: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanDraftForm',
  title: 'Kvörtun til umboðsmanns Alþingis',
  mode: FormModes.APPLYING,
  logo: Logo,
  children: [
    buildSection({
      id: 'conditions',
      title: section.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: dataProvider.dataProviderHeader,
          subTitle: dataProvider.dataProviderSubTitle,
          checkboxLabel: dataProvider.dataProviderCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: dataProvider.nationalRegistryTitle,
              subTitle: dataProvider.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: dataProvider.userProfileTitle,
              subTitle: dataProvider.userProfileSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: section.information,
      children: [
        buildMultiField({
          id: 'information.aboutTheComplainer',
          title: information.general.aboutTheComplainerTitle,
          children: [
            buildTextField({
              id: 'information.name',
              title: information.aboutTheComplainer.name,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  fullName?: string
                })?.fullName || '',
            }),
            buildTextField({
              id: 'information.ssn',
              title: information.aboutTheComplainer.ssn,
              format: '######-####',
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  nationalId?: string
                })?.nationalId || '',
            }),
            buildTextField({
              id: 'information.address',
              title: information.aboutTheComplainer.address,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  address?: {
                    streetAddress?: string
                  }
                })?.address?.streetAddress || '',
            }),
            buildTextField({
              id: 'information.postcode',
              title: information.aboutTheComplainer.postcode,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  address?: {
                    postalCode?: string
                  }
                })?.address?.postalCode || '',
            }),
            buildTextField({
              id: 'information.city',
              title: information.aboutTheComplainer.city,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  address?: {
                    city?: string
                  }
                })?.address?.city || '',
            }),
            buildTextField({
              id: 'information.email',
              title: information.aboutTheComplainer.email,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              variant: 'email',
              defaultValue: (application: Application) =>
                (application.externalData?.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'information.phone',
              title: information.aboutTheComplainer.phone,
              format: '###-####',
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              variant: 'tel',
              defaultValue: (application: Application) =>
                (application.externalData?.userProfile?.data as {
                  mobilePhoneNumber?: string
                })?.mobilePhoneNumber,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'complainee',
      title: section.complainedFor,
      children: [
        buildMultiField({
          id: 'complaineeInformation',
          title: complainedFor.general.complainedForTitle,
          children: [
            buildRadioField({
              id: 'complaineeInformation.radio',
              title: '',
              options: [
                { value: 'myself', label: 'Mig' },
                { value: 'other', label: 'Annan' },
              ],
              largeButtons: true,
              width: 'half',
            }),
            buildDescriptionField({
              id: 'complaineeInformation.description',
              title: 'Athugið',
              description: 'hello',
              condition: (formValue) => {
                const radioValue = (formValue.complaineeInformation as FormValue)
                  ?.radio
                return radioValue === 'myself'
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'complaint',
      title: section.complaint,
      children: [
        buildSubSection({
          id: 'complaint.section.complainee',
          title: section.complainee,
          children: [
            buildMultiField({
              id: 'complainee',
              title: complainee.general.sectionTitle,
              description: complainee.general.sectionDescription,
              children: [
                buildRadioField({
                  id: 'complainee.type',
                  title: '',
                  largeButtons: true,
                  options: [
                    {
                      value: ComplaineeTypes.GOVERNMENT,
                      label: complainee.labels.governmentComplaint,
                    },
                    {
                      value: ComplaineeTypes.OTHER,
                      label: complainee.labels.otherComplaint,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'complaint.section.complaintInformation',
          title: section.complaintInformation,
          children: [
            buildMultiField({
              id: 'section.complaintInformation',
              title: complaintInformation.title,
              children: [
                buildRadioField({
                  id: 'complaintInformation.complaintType',
                  title: '',
                  options: [
                    {
                      label: complaintInformation.decisionLabel,
                      value: OmbudsmanComplaintTypeEnum.DECISION,
                    },
                    {
                      label: complaintInformation.proceedingsLabel,
                      value: OmbudsmanComplaintTypeEnum.PROCEEDINGS,
                    },
                  ],
                }),
                buildCustomField({
                  id: 'complaintInformation.decisionAlertMessage',
                  title: complaintInformation.alertMessageTitle,
                  component: 'FieldAlertMessage',
                  description: complaintInformation.decisionAlertMessage,
                  condition: (answers) =>
                    getComplaintType(answers) ===
                    OmbudsmanComplaintTypeEnum.DECISION,
                }),
                buildCustomField({
                  id: 'complaintInformation.proceedingsAlertMessage',
                  title: complaintInformation.alertMessageTitle,
                  component: 'FieldAlertMessage',
                  description: complaintInformation.proceedingsAlertMessage,
                  condition: (answers) =>
                    getComplaintType(answers) ===
                    OmbudsmanComplaintTypeEnum.PROCEEDINGS,
                }),
              ],
            }),
            buildMultiField({
              id: 'complaintDescription',
              title: complaintDescription.general.pageTitle,
              description: (application) =>
                getComplaintType(application.answers) ===
                OmbudsmanComplaintTypeEnum.DECISION
                  ? complaintDescription.general.decisionInfo
                  : '',
              children: [
                buildDateField({
                  id: 'complaintDescription.decisionDate',
                  title: complaintDescription.labels.decisionDateTitle,
                  placeholder:
                    complaintDescription.labels.decisionDatePlaceholder,
                  backgroundColor: 'blue',
                  width: 'half',
                  condition: (answers) =>
                    getComplaintType(answers) ===
                    OmbudsmanComplaintTypeEnum.DECISION,
                }),
                buildTextField({
                  id: 'complaintDescription.complaineeName',
                  backgroundColor: 'blue',
                  required: true,
                  title: (application) =>
                    isGovernmentComplainee(application.answers)
                      ? complainee.labels.complaineeNameGovernmentTitle
                      : complainee.labels.complaineeNameOtherTitle,
                  placeholder: (application) =>
                    isGovernmentComplainee(application.answers)
                      ? complainee.labels.complaineeNameGovernmentPlaceholder
                      : complainee.labels.complaineeNameOtherPlaceholder,
                }),

                buildTextField({
                  id: 'complaintDescription.complaintDescription',
                  title: complaintDescription.labels.complaintDescriptionTitle,
                  rows: 6,
                  placeholder:
                    complaintDescription.labels.complaintDescriptionPlaceholder,
                  backgroundColor: 'blue',
                  variant: 'textarea',
                  required: true,
                }),
                buildCustomField(
                  {
                    id: 'complaintDescriptionAlert',
                    title: complaintDescription.general.alertTitle,
                    component: 'FieldAlertMessage',
                    description: complaintDescription.general.alertMessage,
                  },
                  { spaceTop: 2 },
                ),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
