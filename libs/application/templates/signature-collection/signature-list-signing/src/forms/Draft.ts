import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import { m } from '../lib/messages'
import { Application } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import { externalData } from '../../../../../../api/mocks/src/domains/applications/factories'
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
          id: 'listInfo',
          title: m.listName,
          condition: (_, externalData) => {
            const lists = getValueViaPath(
              externalData,
              'getList.data',
              [],
            ) as List[]
            return lists.length > 1
          },
          children: [
            buildSelectField({
              id: 'listId',
              title: m.listName,
              defaultValue: ({ externalData }: Application) => {
                const lists = getValueViaPath(
                  externalData,
                  'getList.data',
                  [],
                ) as List[]
                return lists[0].id
              },
              options: ({
                externalData: {
                  getList: { data },
                },
              }) => {
                return (data as List[]).map((list) => ({
                  value: list.id,
                  label: list.title,
                }))
              },
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
              title: m.signeeInformationHeader,
              titleVariant: 'h3',
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
              title: m.countryArea,
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
