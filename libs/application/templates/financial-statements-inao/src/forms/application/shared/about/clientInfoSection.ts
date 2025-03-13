import {
  buildDescriptionField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { UserProfile } from '../../../../types/schema'
import { m } from '../../../../lib/messages'
import { ABOUTIDS } from '../../../../lib/constants'
import { getCurrentUserType } from '../../../../lib/utils/helpers'
import { FSIUSERTYPE } from '../../../../types'
import { Identity } from '@island.is/clients/identity'

export const clientInfoSection = buildSection({
  id: 'info',
  title: m.info,
  children: [
    buildMultiField({
      id: 'about',
      title: m.info,
      description: (application: Application) => {
        const answers = application.answers
        const externalData = application.externalData
        const userType = getCurrentUserType(answers, externalData)
        return userType === FSIUSERTYPE.INDIVIDUAL
          ? m.reviewInfo
          : m.reviewContact
      },
      children: [
        buildDescriptionField({
          id: ABOUTIDS.operatingYear,
        }),
        buildCustomField({
          id: 'OperatingYear',
          childInputIds: [ABOUTIDS.operatingYear],
          condition: (answers, externalData) => {
            const userType = getCurrentUserType(answers, externalData)
            return (
              userType === FSIUSERTYPE.CEMETRY || userType === FSIUSERTYPE.PARTY
            )
          },
          component: 'OperatingYear',
        }),
        buildTextField({
          id: 'about.nationalId',
          title: (application: Application) => {
            const answers = application.answers
            const externalData = application.externalData
            const userType = getCurrentUserType(answers, externalData)
            return userType === FSIUSERTYPE.INDIVIDUAL
              ? m.candidateNationalId
              : m.clientNationalId
          },
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => application.applicant,
        }),
        buildTextField({
          id: 'about.fullName',
          title: (application: Application) => {
            const answers = application.answers
            const externalData = application.externalData
            const userType = getCurrentUserType(answers, externalData)
            return userType === FSIUSERTYPE.INDIVIDUAL
              ? m.candidateFullName
              : m.clientName
          },
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.identity
              .data as Identity
            return nationalRegistry.name
          },
        }),
        buildDescriptionField({
          id: ABOUTIDS.powerOfAttorneyName,
        }),
        buildCustomField({
          id: 'powerOfAttorney',
          description: '',
          component: 'PowerOfAttorneyFields',
          childInputIds: [
            ABOUTIDS.powerOfAttorneyNationalId,
            ABOUTIDS.powerOfAttorneyName,
          ],
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
        buildCustomField({
          id: 'delegation check',
          component: 'DelegationCheck',
        }),
      ],
    }),
  ],
})
