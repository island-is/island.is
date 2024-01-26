import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildRadioField,
  buildSubmitField,
  buildSelectField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { EstateTypes } from '../lib/constants'
import { m } from '../lib/messages'
import { EstateInfo } from '@island.is/clients/syslumenn'

export const getForm = ({
  allowDivisionOfEstate = false,
  allowEstateWithoutAssets = false,
  allowPermitToPostponeEstateDivision = false,
  allowDivisionOfEstateByHeirs = false,
}): Form =>
  buildForm({
    id: 'PrerequisitesDraft',
    title: '',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'selectEstate',
        title: '',
        children: [
          buildMultiField({
            id: 'estate',
            title: m.prerequisitesTitle,
            children: [
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
                required: true,
              }),
              buildDescriptionField({
                id: 'applicationInfo',
                space: 'containerGutter',
                title: '',
                description: m.prerequisitesSubtitle,
              }),
              buildRadioField({
                id: 'selectedEstate',
                title: '',
                width: 'full',
                required: true,
                options: [
                  ...(allowDivisionOfEstate
                    ? [
                        {
                          value: EstateTypes.officialDivision,
                          label: EstateTypes.officialDivision,
                        },
                      ]
                    : []),
                  ...(allowEstateWithoutAssets
                    ? [
                        {
                          value: EstateTypes.estateWithoutAssets,
                          label: EstateTypes.estateWithoutAssets,
                        },
                      ]
                    : []),
                  ...(allowPermitToPostponeEstateDivision
                    ? [
                        {
                          value: EstateTypes.permitForUndividedEstate,
                          label: EstateTypes.permitForUndividedEstate,
                        },
                      ]
                    : []),
                  ...(allowDivisionOfEstateByHeirs
                    ? [
                        {
                          value: EstateTypes.divisionOfEstateByHeirs,
                          label: EstateTypes.divisionOfEstateByHeirs,
                        },
                      ]
                    : []),
                ],
              }),
              buildSubmitField({
                id: 'estate.submit',
                title: '',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: m.confirmButton,
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
