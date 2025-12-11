import {
  buildMultiField,
  buildPhoneField,
  buildSelectField,
  buildTextField,
  buildSubSection,
  buildCheckboxField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { EstateMember } from '../../types'
import { Application } from '@island.is/api/schema'

export const subSectionInfo = buildSubSection({
  id: 'infoStep',
  title: m.announcementTitle,
  children: [
    buildMultiField({
      id: 'announcement',
      title: m.announcementTitle,
      description: m.announcementDescription,
      space: 1,
      children: [
        buildTextField({
          id: 'applicantName',
          title: m.applicantsName,
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'nationalRegistry.data.fullName',
            ) ?? '',
        }),
        buildPhoneField({
          id: 'applicantPhone',
          title: m.applicantsPhoneNumber,
          placeholder: '',
          width: 'half',
          enableCountrySelector: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ) ?? '',
        }),
        buildTextField({
          id: 'applicantEmail',
          title: m.applicantsEmail,
          placeholder: '',
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email ?? '',
        }),
        buildSelectField({
          id: 'applicantRelation',
          title: m.applicantsRelation,
          placeholder: m.applicantsRelationPlaceholder,
          width: 'half',
          defaultValue: (application: Application) => {
            const estateMembers = getValueViaPath<Array<EstateMember>>(
              application.externalData,
              'syslumennOnEntry.data.estate.estateMembers',
            )
            const applicantRelation = estateMembers?.find(
              (em) => em.nationalId === application.applicant,
            )
            return applicantRelation?.relation ?? ''
          },
          options: ({ externalData }) => {
            const relationOptions =
              getValueViaPath<Array<string>>(
                externalData,
                'syslumennOnEntry.data.relationOptions',
              ) ?? []
            return relationOptions?.map((relation) => ({
              value: relation,
              label: relation,
            }))
          },
        }),
        buildCheckboxField({
          id: 'addApplicantToEstateMembers',
          large: false,
          backgroundColor: 'white',
          defaultValue: [YES],
          options: [{ value: YES, label: m.addApplicantToEstateMembers }],
        }),
      ],
    }),
  ],
})
