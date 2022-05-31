import {
  Application,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildTextField,
  buildRadioField,
} from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import type { User } from '@island.is/api/domains/national-registry'
import { UserProfile } from '../../../types/schema'
import { m } from '../../../lib/messages'
import { GREATER, LESS } from '../../../lib/constants'

export const clientInfoSection = buildSection({
  id: 'info',
  title: m.infoSection,
  children: [
    buildSubSection({
      id: 'generalInfo',
      title: m.generalInfo,
      children: [
        buildMultiField({
          id: 'about',
          title: m.about,
          children: [
            buildTextField({
              id: 'about.nationalId',
              title: m.nationalId,
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) => formatNationalId(application.applicant)
            }),
            buildTextField({
              id: 'about.fullName',
              title: m.fullName,
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) => {
                const nationalRegistry = application.externalData
                  .nationalRegistry.data as User
                return nationalRegistry.fullName
              },
            }),
            buildTextField({
              id: 'about.powerOfAttorneyNationalId',
              title: m.powerOfAttorneyNationalId,
              width: 'half',
            }),
            buildTextField({
              id: 'about.powerOfAttorneyName',
              title: m.powerOfAttorneyName,
              width: 'half',
            }),
            buildTextField({
              id: 'about.email',
              title: m.email,
              width: 'half',
              variant: 'email',
              defaultValue: (application: Application) => {
                const userProfile = application.externalData.userProfile
                  .data as UserProfile
                return userProfile.email
              },
            }),
            buildTextField({
              id: 'about.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              variant: 'tel',
              defaultValue: (application: Application) => {
                const userProfile = application.externalData.userProfile
                  .data as UserProfile
                return userProfile.mobilePhoneNumber
              },
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'elections',
      title: m.electionCampaign,
      children: [
        buildMultiField({
          id: 'electionInfo',
          title: '',
          children: [
            buildDescriptionField({
              id: 'electionInfo.electionType',
              description: m.selectElectionType,
              title: m.electionType,
              space: 3,
            }),
            buildSelectField({
              id: 'electionInfo.selectElectionType',
              title: m.election,
              width: 'half',
              placeholder: m.pickElectionType,
              options: [
                { label: 'Forsetakosningar', value: 'Forsetakosningar' },
                { label: 'Alþingiskosningar', value: 'Alþingiskosningar' },
              ],
            }),
            buildDescriptionField({
              id: 'electionInfo.electionDescription',
              title: m.campaignCost,
              titleVariant: "h3",
              description: m.pleaseSelect,
              space: 5
            }),
            buildRadioField({
              id: 'electionInfo.incomeLimit',
              title: '',
              options: [
                { value: LESS, label: m.lessThanLimit },
                { value: GREATER, label: m.moreThanLimit },
              ],
              width: 'full',
              largeButtons: true,
            }),
          ],
        }),
      ],
    }),
  ],
})
