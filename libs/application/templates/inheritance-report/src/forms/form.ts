import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { UserProfile, Application } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import { removeCountryCode } from '@island.is/application/ui-components'

import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { assets } from './assets'
import { debts } from './debts'
import { business } from './business'
import { heirs } from './heirs'
import { funeralCost } from './funeralCost'

export const form: Form = buildForm({
  id: 'inheritanceReport',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'step1',
      title: m.dataCollectionTitle,
      children: [],
    }),
    buildSection({
      id: 'step2',
      title: m.irSubmitTitle,
      children: [],
    }),
    buildSection({
      id: 'applicantsInformation',
      title: m.applicantsInfo,
      children: [
        buildMultiField({
          id: 'applicant',
          title: m.applicantsInfo,
          description: m.applicantsInfoSubtitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return formatNationalId(
                  externalData.nationalRegistry?.data.nationalId,
                )
              },
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.address,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.address.streetAddress
              },
            }),
            buildTextField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
              format: '###-####',
              defaultValue: (application: Application) => {
                const phone =
                  (
                    application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    }
                  )?.mobilePhoneNumber ?? ''

                return removeCountryCode(phone)
              },
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                const data = externalData.userProfile?.data as UserProfile
                return data?.email
              },
            }),
          ],
        }),
      ],
    }),
    assets,
    debts,
    funeralCost,
    business,
    heirs,
    buildSection({
      id: 'finalStep',
      title: 'Skila inn erfðafjárskýrslu',
      children: [
        buildMultiField({
          id: 'finalStep',
          title: 'Skila inn erfðafjárskýrslu',
          description: '',
          children: [
            buildSubmitField({
              id: 'inheritanceReport.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitReport,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
