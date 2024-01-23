import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { EstateInfo } from '@island.is/clients/syslumenn'

export const estateInfoSelection = buildMultiField({
  id: 'estateSelect',
  title: m.chooseEstate,
  description: m.chooseEstateDescription,
  children: [
    buildDescriptionField({
      id: 'spaceSubmission',
      title: '',
      space: 'containerGutter',
    }),
    buildSelectField({
      id: 'estateInfoSelection',
      title: m.chooseEstateSelectTitle,
      defaultValue: (application: {
        externalData: {
          syslumennOnEntry: { data: { estates: EstateInfo[] } }
        }
      }) => {
        return (
          application.externalData.syslumennOnEntry?.data as {
            estates: Array<EstateInfo>
          }
        ).estates[0].caseNumber
      },
      options: (application) => {
        return (
          application.externalData.syslumennOnEntry?.data as {
            estates: Array<EstateInfo>
          }
        ).estates.map((estate) => {
          return {
            value: estate.caseNumber,
            label: estate.nameOfDeceased,
          }
        })
      },
    }),
  ],
})
