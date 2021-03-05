import {
  buildForm,
  buildDescriptionField,
  buildSection,
  Form,
  FormModes,
  buildRadioField,
  buildTextField,
  buildMultiField,
  buildCustomField,
  FormValue,
  buildSubSection,
  buildFileUploadField,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, YES } from '../shared'
import { section, delimitation, errorCards, info } from '../lib/messages'
import { OnBehalf } from '../lib/dataSchema'

const yesOption = { value: 'yes', label: 'Já' }
const noOption = { value: 'no', label: 'Nei' }

export const ComplaintForm: Form = buildForm({
  id: 'DataProtectionComplaintForm',
  title: 'Atvinnuleysisbætur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'delimitation',
      title: section.delimitation.defaultMessage,
      children: [
        buildSubSection({
          id: 'authoritiesSection',
          title: section.authorities.defaultMessage,
          children: [
            buildMultiField({
              id: 'inCourtProceedingsFields',
              title: delimitation.labels.inCourtProceedings,
              description: delimitation.general.description,
              children: [
                buildRadioField({
                  id: 'inCourtProceedings',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField({
                  component: 'FieldAlertMessage',
                  id: 'inCourtProceedingsAlert',
                  title: errorCards.inCourtProceedingsTitle,
                  description: errorCards.inCourtProceedingsDescription,
                  condition: (formValue) =>
                    formValue.inCourtProceedings === YES,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'mediaSection',
          title: section.media.defaultMessage,
          children: [
            buildMultiField({
              id: 'concernsMediaCoverageFields',
              title: delimitation.labels.concernsMediaCoverage,
              description: delimitation.general.description,
              children: [
                buildRadioField({
                  id: 'concernsMediaCoverage',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField({
                  component: 'FieldAlertMessage',
                  id: 'concernsMediaCoverageAlert',
                  title: errorCards.concernsMediaCoverageTitle,
                  description: errorCards.concernsMediaCoverageDescription,
                  condition: (formValue) =>
                    formValue.concernsMediaCoverage === YES,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'banMarkingSection',
          title: section.banMarking.defaultMessage,
          children: [
            buildMultiField({
              id: 'concernsBanMarkingFields',
              title: delimitation.labels.concernsBanMarking,
              description: delimitation.general.description,
              children: [
                buildRadioField({
                  id: 'concernsBanMarking',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField({
                  component: 'FieldAlertMessage',
                  id: 'concernsBanMarkingAlert',
                  title: errorCards.concernsBanMarkingTitle,
                  description: errorCards.concernsBanMarkingDescription,
                  condition: (formValue) =>
                    formValue.concernsBanMarking === YES,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'libelSection',
          title: section.libel.defaultMessage,
          children: [
            buildMultiField({
              id: 'concernsLibelFields',
              title: delimitation.labels.concernsLibel,
              children: [
                buildRadioField({
                  id: 'concernsLibel',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField({
                  component: 'FieldAlertMessage',
                  id: 'concernsLibelAlert',
                  title: errorCards.concernsLibelTitle,
                  description: errorCards.concernsLibelDescription,
                  condition: (formValue) => formValue.concernsLibel === YES,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: section.info.defaultMessage,
      children: [
        buildSubSection({
          id: 'onBehalf',
          title: section.onBehalf.defaultMessage,
          children: [
            buildMultiField({
              id: 'onBehalfFields',
              title: info.general.pageTitle,
              description: info.general.description,
              children: [
                buildRadioField({
                  id: 'info.onBehalf',
                  title: '',
                  options: [
                    { value: OnBehalf.MYSELF, label: info.labels.myself },
                    {
                      value: OnBehalf.MYSELF_AND_OR_OTHERS,
                      label: info.labels.myselfAndOrOthers,
                    },
                    { value: OnBehalf.COMPANY, label: info.labels.company },
                    {
                      value: OnBehalf.ORGANIZATION_OR_INSTITUTION,
                      label: info.labels.organizationInstitution,
                    },
                  ],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField({
                  component: 'FieldAlertMessage',
                  id: 'info.onBehalfOfACompanyAlertMessage',
                  title: errorCards.onBehalfOfACompanyTitle,
                  description: errorCards.onBehalfOfACompanyDescription,
                  condition: (formValue) =>
                    (formValue.info as FormValue)?.onBehalf ===
                    OnBehalf.COMPANY,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'applicant',
          title: section.applicant.defaultMessage,
          condition: (formValue) => {
            const onBehalf = (formValue.info as FormValue).onBehalf
            return (
              onBehalf === OnBehalf.MYSELF ||
              onBehalf === OnBehalf.MYSELF_AND_OR_OTHERS
            )
          },
          children: [
            buildMultiField({
              id: 'applicantSection',
              title: info.general.applicantPageTitle,
              description: info.general.applicantPageDescription,
              children: [
                buildTextField({
                  id: 'applicant.name',
                  title: info.labels.name,
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'applicant.nationalId',
                  title: info.labels.nationalId,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'applicant.address',
                  title: info.labels.address,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'applicant.postalCode',
                  title: info.labels.postalCode,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'applicant.city',
                  title: info.labels.city,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'applicant.email',
                  title: info.labels.email,
                  width: 'half',
                  variant: 'email',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'applicant.phoneNumber',
                  title: info.labels.tel,
                  width: 'half',
                  variant: 'tel',
                  backgroundColor: 'blue',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'organizationOrInstitution',
          title: section.organizationOrInstitution.defaultMessage,
          condition: (formValue) =>
            (formValue.info as FormValue)?.onBehalf ===
            OnBehalf.ORGANIZATION_OR_INSTITUTION,
          children: [
            buildMultiField({
              id: 'organizationOrInstitutionSection',
              title: info.general.organizationOrInstitutionPageTitle,
              description:
                info.general.organizationOrInstitutionPageDescription,
              children: [
                buildTextField({
                  id: 'organizationOrInstitution.name',
                  title: info.labels.organizationOrInstitutionName,
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.nationalId',
                  title: info.labels.nationalId,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.address',
                  title: info.labels.address,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.postalCode',
                  title: info.labels.postalCode,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.city',
                  title: info.labels.city,
                  width: 'half',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.email',
                  title: info.labels.email,
                  width: 'half',
                  variant: 'email',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.phoneNumber',
                  title: info.labels.tel,
                  width: 'half',
                  variant: 'tel',
                  backgroundColor: 'blue',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'commissions',
          title: section.commissions.defaultMessage,
          condition: (formValue) => {
            const onBehalf = (formValue.info as FormValue).onBehalf
            return onBehalf === OnBehalf.MYSELF_AND_OR_OTHERS
          },
          children: [
            buildMultiField({
              title: info.general.commissionsPageTitle,
              description: info.general.commissionsPageDescription,
              children: [
                buildFileUploadField({
                  id: 'comissions.documents',
                  title: '',
                  introduction: '',
                  maxSize: FILE_SIZE_LIMIT,
                  uploadHeader: info.labels.commissionsDocumentsHeader,
                  uploadDescription:
                    info.labels.commissionsDocumentsDescription,
                  uploadButtonLabel:
                    info.labels.commissionsDocumentsButtonLabel,
                }),
                buildTextField({
                  id: 'commissions.name',
                  title: info.labels.name,
                  backgroundColor: 'blue',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesting',
      children: [
        buildDescriptionField({
          id: 'field',
          title: 'Vel gert!',
          description:
            'Þú ert komin/n út á enda, ef þú ýtir á næsta skref þá læsist umsóknin',
        }),
      ],
    }),
    buildSection({
      id: 'confirmation2',
      title: 'Búið',
      children: [
        buildDescriptionField({
          id: 'field',
          title: 'Vel gert!',
          description: 'Þú ert komin/n út á enda',
        }),
      ],
    }),
  ],
})
