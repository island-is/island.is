import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { information } from '../../lib/messages'
import { Application } from '@island.is/api/schema'
import { PermitProgram } from '../../lib'

export const SelectWorkPermitSection = buildSection({
  id: 'selectWorkPermitSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'selectWorkPermit.multiField',
      title: information.labels.selectWorkPermit.pageTitle,
      description: information.labels.selectWorkPermit.description,
      children: [
        buildRadioField({
          id: 'selectWorkPermit.programId',
          title: information.labels.selectWorkPermit.sectionTitle,
          defaultValue: (application: Application) =>
            application.externalData?.permitOptions.data[0].programId,
          options: (application) => {
            const permitPrograms = application?.externalData.permitOptions
              .data as PermitProgram[]
            return permitPrograms.map((permitProgram) => {
              return {
                value: permitProgram.programId || '',
                label: permitProgram.name || '',
                subLabel: permitProgram.errorMsg,
                disabled: permitProgram.error,
              }
            })
          },
        }),
      ],
    }),
  ],
})
