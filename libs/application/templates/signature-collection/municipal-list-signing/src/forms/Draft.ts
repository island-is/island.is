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
import { IndividualDto } from '@island.is/clients/national-registry-v2'
import { format as formatNationalId } from 'kennitala'

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
              defaultValue: ({ answers, externalData }: Application) => {
                const lists =
                  getValueViaPath<SignatureCollectionList[]>(
                    externalData,
                    'getList.data',
                  ) || []

                const nationalId =
                  lists.length === 1
                    ? lists[0].candidate.nationalId
                    : lists.find((list) => list.id === answers.listId)
                        ?.candidate.nationalId

                return nationalId ? formatNationalId(nationalId) : undefined
              },
            }),
            buildTextField({
              id: 'municipality',
              title: m.municipality,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) => {
                const municipalIdentity = getValueViaPath<IndividualDto>(
                  externalData,
                  'municipalIdentity.data',
                )
                return municipalIdentity?.legalDomicile?.locality
              },
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
