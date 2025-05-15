import {
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'

import { m } from '../lib/messages'
import { SignatureCollectionList } from '@island.is/api/schema'
import Logo from '@island.is/application/templates/signature-collection/assets/Logo'

export const Draft: Form = buildForm({
  id: 'SignListDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: false,
  logo: Logo,
  children: [
    buildSection({
      id: 'selectCandidateSection',
      condition: (_, externalData) => {
        const lists =
          getValueViaPath<SignatureCollectionList[]>(
            externalData,
            'getList.data',
          ) || []
        return lists.length > 1
      },
      children: [
        buildMultiField({
          id: 'selectCandidateSection',
          title: m.selectCandidate,
          description: m.selectCandidateDescription,
          children: [
            buildRadioField({
              id: 'listId',
              backgroundColor: 'white',
              defaultValue: '',
              required: true,
              options: ({ externalData }) => {
                const data =
                  getValueViaPath<SignatureCollectionList[]>(
                    externalData,
                    'getList.data',
                  ) || []
                return data?.map((list) => ({
                  value: list.id,
                  label: list.title,
                  disabled:
                    list.maxReached || new Date(list.endTime) < new Date(),
                  tag: list.maxReached
                    ? {
                        label: m.selectCandidateMaxReached.defaultMessage,
                        variant: 'red',
                        outlined: true,
                      }
                    : new Date(list.endTime) < new Date()
                    ? {
                        label: m.selectCandidateListExpired.defaultMessage,
                        variant: 'red',
                        outlined: true,
                      }
                    : undefined,
                }))
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'signeeInfo',
      children: [
        buildMultiField({
          id: 'signeeInfo',
          title: m.listName,
          description: m.listDescription,
          children: [
            buildTextField({
              id: 'municipality',
              title: m.municipality,
              width: 'full',
              readOnly: true,
              //Todo: update once available from externalData
              defaultValue: 'Borgarbyggð',
            }),
            buildTextField({
              id: 'candidateName',
              title: m.candidateName,
              width: 'full',
              readOnly: true,
              defaultValue: ({ answers, externalData }: Application) => {
                const lists =
                  getValueViaPath<SignatureCollectionList[]>(
                    externalData,
                    'getList.data',
                  ) || []

                return lists.length === 1
                  ? lists[0].candidate.name
                  : lists.find((list) => list.id === answers.listId)?.candidate
                      .name
              },
            }),
            buildTextField({
              id: 'guarantorsNationalId',
              title: m.guarantorsNationalId,
              width: 'half',
              readOnly: true,
              //Todo: update once available from externalData
              defaultValue: '010130-3019',
            }),
            buildTextField({
              id: 'guarantorsName',
              title: m.guarantorsName,
              width: 'half',
              readOnly: true,
              //Todo: update once available from externalData
              defaultValue: 'Jón Jónsson',
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
  ],
})
