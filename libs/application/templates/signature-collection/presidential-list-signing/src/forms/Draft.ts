import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import { m } from '../lib/messages'
import { Application, SignatureCollectionList } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
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
            buildDescriptionField({
              id: 'candidateInfoHeader',
              title: m.candidateInformationHeader,
              titleVariant: 'h4',
            }),
            buildTextField({
              id: 'candidateName',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: ({ answers, externalData }: Application) => {
                const lists =
                  getValueViaPath<SignatureCollectionList[]>(
                    externalData,
                    'getList.data',
                  ) || []

                if (lists.length === 1) {
                  return lists[0].candidate.name
                }

                const candidateName = lists.find(
                  (list) => list.id === answers.listId,
                )?.candidate.name

                return candidateName
              },
            }),
            buildDescriptionField({
              id: 'spaceDivider',
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'signeeInfoHeader',
              title: m.signeeInformationHeader,
              titleVariant: 'h4',
              space: 'containerGutter',
            }),
            buildTextField({
              id: 'signee.name',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: ({ externalData }: Application) =>
                getValueViaPath(
                  externalData,
                  'nationalRegistry.data.fullName',
                ) || '',
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
              defaultValue: ({ externalData }: Application) =>
                getValueViaPath(externalData, 'canSign.data.area.name') || '',
            }),
            buildTextField({
              id: 'signee.address',
              title: m.address,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) =>
                getValueViaPath(
                  externalData,
                  'nationalRegistry.data.address.streetAddress',
                ) || '',
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
