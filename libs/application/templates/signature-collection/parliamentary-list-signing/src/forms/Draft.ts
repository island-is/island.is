import {
  buildDescriptionField,
  buildForm,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Application, SignatureCollectionList } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import Logo from '../../assets/Logo'

import { m } from '../lib/messages'

export const Draft: Form = buildForm({
  id: 'ParliamentaryListSigningDraft',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
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
      id: 'signListInformationSection',
      title: m.information,
      children: [
        buildMultiField({
          id: 'listInformation',
          title: m.signListViewTitle,
          description: m.signListViewDescription,
          children: [
            buildDescriptionField({
              id: 'listHeader',
              title: m.listHeader,
              titleVariant: 'h3',
            }),
            buildHiddenInput({
              id: 'listId',
              defaultValue: ({ answers, externalData }: Application) => {
                const lists = getValueViaPath(
                  externalData,
                  'getList.data',
                  [],
                ) as SignatureCollectionList[]

                const initialQuery = getValueViaPath(
                  answers,
                  'initialQuery',
                  '',
                )

                return lists.find((x) => x.candidate.id === initialQuery)?.id
              },
            }),
            buildTextField({
              id: 'list.name',
              title: m.listName,
              width: 'half',
              readOnly: true,
              defaultValue: ({ answers, externalData }: Application) => {
                const lists = getValueViaPath(
                  externalData,
                  'getList.data',
                  [],
                ) as SignatureCollectionList[]

                const initialQuery = getValueViaPath(
                  answers,
                  'initialQuery',
                  '',
                )

                return lists.find((x) => x.candidate.id === initialQuery)?.title
              },
            }),
            buildTextField({
              id: 'list.letter',
              title: m.listLetter,
              width: 'half',
              readOnly: true,
              defaultValue: ({ answers, externalData }: Application) => {
                const lists = getValueViaPath(
                  externalData,
                  'getList.data',
                  [],
                ) as SignatureCollectionList[]

                const initialQuery = getValueViaPath(
                  answers,
                  'initialQuery',
                  '',
                )

                return lists.find((x) => x.candidate.id === initialQuery)
                  ?.candidate?.partyBallotLetter
              },
            }),
            buildDescriptionField({
              id: 'signeeHeader',
              title: m.signeeHeader,
              titleVariant: 'h3',
              marginTop: 'containerGutter',
            }),
            buildTextField({
              id: 'signee.name',
              title: m.name,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) =>
                externalData.nationalRegistry?.data.fullName,
            }),
            buildTextField({
              id: 'signee.nationalId',
              title: m.nationalId,
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) =>
                formatNationalId(application.applicant),
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
    /* Section setup for the stepper */
    buildSection({
      id: 'done',
      title: m.listSigned,
      children: [],
    }),
  ],
})
