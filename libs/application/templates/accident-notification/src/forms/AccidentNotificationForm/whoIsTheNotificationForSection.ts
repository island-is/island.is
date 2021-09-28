import {
  buildCheckboxField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'

import {
  childInCustody,
  injuredPersonInformation,
  juridicalPerson,
  powerOfAttorney,
  whoIsTheNotificationFor,
} from '../../lib/messages'

import {
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from '../../types'
import {
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
} from '../../utils'
import { isPowerOfAttorney } from '../../utils/isPowerOfAttorney'
import { UPLOAD_ACCEPT, YES } from '../../constants'
import { isUploadNow } from '../../utils/isUploadNow'

export const whoIsTheNotificationForSection = buildSection({
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
          width: 'half',
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
            {
              value: WhoIsTheNotificationForEnum.CHILDINCUSTODY,
              label: whoIsTheNotificationFor.labels.childInCustody,
            },
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'injuredPersonInformation.section',
      title: injuredPersonInformation.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'injuredPersonInformation',
          title: injuredPersonInformation.general.heading,
          description: (formValue) =>
            isReportingOnBehalfOfEmployee(formValue.answers)
              ? injuredPersonInformation.general.juridicalDescription
              : injuredPersonInformation.general.description,
          children: [
            buildTextField({
              id: 'injuredPersonInformation.name',
              title: injuredPersonInformation.labels.name,
              width: 'half',
              backgroundColor: 'blue',
              required: true,
            }),
            buildTextField({
              id: 'injuredPersonInformation.nationalId',
              title: injuredPersonInformation.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'blue',
              required: true,
            }),
            buildTextField({
              id: 'injuredPersonInformation.email',
              title: injuredPersonInformation.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              variant: 'email',
              required: true,
            }),
            buildTextField({
              id: 'injuredPersonInformation.phoneNumber',
              title: injuredPersonInformation.labels.tel,
              backgroundColor: 'blue',
              format: '###-####',
              width: 'half',
              variant: 'tel',
            }),
          ],
        }),
      ],
      condition: (formValue) => isReportingOnBehalfOfInjured(formValue),
    }),
    buildSubSection({
      id: 'juridicalPerson.company',
      title: juridicalPerson.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'juridicalPerson.company',
          title: juridicalPerson.general.title,
          description: juridicalPerson.general.description,
          children: [
            buildTextField({
              id: 'juridicalPerson.companyName',
              backgroundColor: 'blue',
              title: juridicalPerson.labels.companyName,
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'juridicalPerson.companyNationalId',
              backgroundColor: 'blue',
              title: juridicalPerson.labels.companyNationalId,
              format: '######-####',
              width: 'half',
              required: true,
            }),
            buildCheckboxField({
              id: 'juridicalPerson.companyConfirmation',
              title: '',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label: juridicalPerson.labels.confirmation,
                },
              ],
            }),
          ],
        }),
      ],
      condition: (formValue) => isReportingOnBehalfOfEmployee(formValue),
    }),
    buildSubSection({
      id: 'powerOfAttorney.type.section',
      title: powerOfAttorney.type.sectionTitle,
      children: [
        buildMultiField({
          id: 'powerOfAttorney.type.multifield',
          title: powerOfAttorney.type.heading,
          description: powerOfAttorney.type.description,
          children: [
            buildRadioField({
              id: 'powerOfAttorney.type',
              title: '',
              options: [
                {
                  value: PowerOfAttorneyUploadEnum.UPLOADNOW,
                  label: powerOfAttorney.labels.uploadNow,
                },
                {
                  value: PowerOfAttorneyUploadEnum.UPLOADLATER,
                  label:
                    'Ég vil klára að tilkynna slys og skila inn umboði síðar',
                },
              ],
            }),
          ],
        }),
      ],
      condition: (formValue) => isPowerOfAttorney(formValue),
    }),
    buildSubSection({
      id: 'childInCustody.section',
      title: childInCustody.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'childInCustody.fields',
          title: childInCustody.general.screenTitle,
          description: childInCustody.general.screenDescription,
          children: [
            buildTextField({
              id: 'childInCustody.name',
              backgroundColor: 'blue',
              title: childInCustody.labels.name,
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'childInCustody.nationalId',
              backgroundColor: 'blue',
              title: childInCustody.labels.nationalId,
              format: '######-####',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'childInCustody.email',
              backgroundColor: 'blue',
              title: childInCustody.labels.email,
              variant: 'email',
              width: 'half',
            }),
            buildTextField({
              id: 'childInCustody.phoneNumber',
              backgroundColor: 'blue',
              variant: 'tel',
              title: childInCustody.labels.tel,
              format: '###-####',
              width: 'half',
            }),
          ],
        }),
      ],
      condition: (answers) => isReportingOnBehalfOfChild(answers),
    }),
    buildSubSection({
      id: 'powerOfAttorney.upload.section',
      title: powerOfAttorney.upload.sectionTitle,
      children: [
        buildMultiField({
          id: 'powerOfAttorney',
          title: powerOfAttorney.upload.heading,
          description: powerOfAttorney.upload.description,
          children: [
            buildFileUploadField({
              id: 'attachments.powerOfAttorneyFile',
              title: '',
              introduction: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: powerOfAttorney.upload.uploadHeader,
              uploadDescription: powerOfAttorney.upload.uploadDescription,
              uploadButtonLabel: powerOfAttorney.upload.uploadButtonLabel,
            }),
          ],
        }),
      ],
      condition: (formValue) => isUploadNow(formValue),
    }),
  ],
})
