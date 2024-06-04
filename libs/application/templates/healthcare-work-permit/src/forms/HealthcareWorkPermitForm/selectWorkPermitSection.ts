import {
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { information } from '../../lib/messages'
import {
  StudentTrackDto,
  StudentTrackInstitutionDto,
} from '@island.is/clients/university-careers'
import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/api/schema'

interface Message {
  id: string
  defaultMessage: string
  description: string
}

interface PermitProgram {
  name?: string
  programId?: string
  institution?: StudentTrackInstitutionDto
  error?: boolean
  errorMsg?: Message | string
  professionId?: string
  prereq?: StudentTrackDto // TODO Probably don't need this
}

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
                subLabel: '',
                disabled: permitProgram.error,
              }
            })
          },
        }),
      ],
    }),
  ],
})
