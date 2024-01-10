import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import { m } from '../lib/messages'
import { Application, SignatureCollectionList } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import { List } from '../lib/constants'

export const Draft: Form = buildForm({
  id: 'SignListDraft',
  title: m.applicationName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'screen1',
      title: m.intro,
      children: [],
    }),
    buildSection({
      id: 'screen2',
      title: m.dataCollection,
      children: [],
    }),
    buildSection({
      id: 'signeeInfo',
      title: m.information,

      children: [
        buildSubSection({
          id: 'selectCandidate',
          title: m.selectCandidate,
          condition: (_, externalData) => {
            const lists = getValueViaPath(
              externalData,
              'getList.data',
              [],
            ) as SignatureCollectionList[]
            return lists.length > 1
          },
          children: [
            buildMultiField({
              id: 'selectCandidate',
              title: m.selectCandidate,
              description: m.selectCandidateDescription,
              children: [
                buildRadioField({
                  id: 'listId',
                  title: '',
                  defaultValue: ({ externalData }: Application) => {
                    const lists = getValueViaPath(
                      externalData,
                      'getList.data',
                      [],
                    ) as SignatureCollectionList[]
                    return lists[0].id
                  },
                  options: ({
                    externalData: {
                      getList: { data },
                    },
                  }) => {
                    return (data as SignatureCollectionList[]).map((list) => ({
                      value: list.id,
                      label: list.candidate.name + ' - ' + list.area.name,
                    }))
                  },
                }),
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'signeeInfo',
          title: m.listName,
          description: m.listDescription,
          children: [
            buildDescriptionField({
              id: 'signeeInfoHeader',
              title: m.candidateInformationHeader,
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'candidate.name',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: ({ externalData }: Application) => {
                const list = getValueViaPath(
                  externalData,
                  'getList.data',
                  [],
                ) as SignatureCollectionList[]

                return list[0].candidate?.name ?? ''
              },
            }),
            buildDescriptionField({
              id: 'spaceDivider',
              title: '',
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'signeeInfoHeader',
              title: m.signeeInformationHeader,
              titleVariant: 'h3',
              space: 'containerGutter',
            }),
            buildTextField({
              id: 'signee.name',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: ({ externalData }: Application) =>
                externalData.nationalRegistry?.data.fullName,
            }),
            buildTextField({
              id: 'signee.nationalId',
              title: m.nationalId,
              width: 'full',
              readOnly: true,
              defaultValue: (application: Application) =>
                formatNationalId(application.applicant),
            }),
            buildTextField({
              id: 'signee.area',
              title: m.countryArea,
              width: 'half',
              readOnly: true,
              defaultValue: 'Sunnlendingafjórðungur',
            }),
            buildTextField({
              id: 'signee.address',
              title: m.address,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) =>
                externalData.nationalRegistry?.data.address?.streetAddress,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.signList,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.signList,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'done',
      title: m.listSigned,
      children: [],
    }),
  ],
})
