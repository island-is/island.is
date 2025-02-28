import {
  buildActionCardListField,
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Application, UserProfile } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import Logo from '../../assets/Logo'

import { m } from '../lib/messages'
import { formatPhone } from '../lib/utils'
import { Collection } from '@island.is/clients/signature-collection'
import { Signee } from '@island.is/clients/signature-collection'

export const Draft: Form = buildForm({
  id: 'ParliamentaryListCreationDraft',
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
      id: 'listInformationSection',
      title: m.information,
      children: [
        buildMultiField({
          id: 'listInformation',
          title: m.listInformationSection,
          description: m.listInformationDescription,
          children: [
            buildDescriptionField({
              id: 'listHeader',
              title: m.listHeader,
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'list.name',
              title: m.listName,
              width: 'full',
              readOnly: true,
              defaultValue: (application: Application) =>
                (application.externalData.candidate.data as Signee)
                  .partyBallotLetterInfo?.name ?? '',
            }),
            buildTextField({
              id: 'list.letter',
              title: m.listLetter,
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) =>
                (application.externalData.candidate.data as Signee)
                  .partyBallotLetterInfo?.letter ?? '',
            }),
            buildTextField({
              id: 'list.nationalId',
              title: m.nationalId,
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) =>
                formatNationalId(application.applicant),
            }),
            buildDescriptionField({
              id: 'applicantHeader',
              title: m.applicantActorHeader,
              titleVariant: 'h3',
              space: 'containerGutter',
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) => {
                return externalData.parliamentaryIdentity?.data.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'half',
              readOnly: true,
              defaultValue: (application: Application) =>
                application?.applicantActors[0]
                  ? formatNationalId(application?.applicantActors[0])
                  : formatNationalId(application.applicant),
            }),
            buildPhoneField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
              required: true,
              allowedCountryCodes: ['IS'],
              defaultValue: (application: Application) => {
                const phone =
                  (
                    application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    }
                  )?.mobilePhoneNumber ?? ''

                return phone
              },
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              required: true,
              defaultValue: ({ externalData }: Application) => {
                const data = externalData.userProfile?.data as UserProfile
                return data?.email
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'constituency',
      title: m.constituency,
      children: [
        buildMultiField({
          id: 'constituency',
          title: m.selectConstituency,
          description: m.selectConstituencyDescription,
          children: [
            buildCheckboxField({
              id: 'constituency',
              large: true,
              defaultValue: (application: Application) => {
                const collection = application.externalData
                  .parliamentaryCollection.data as Collection

                if (!collection?.areas) {
                  return []
                }

                return collection.areas.map((area) => `${area.id}|${area.name}`)
              },
              options: (application) => {
                return (
                  application.externalData.parliamentaryCollection
                    .data as Collection
                )?.areas.map((area) => ({
                  value: `${area.id}|${area.name}`,
                  label: area.name,
                }))
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overview,
          description: m.overviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'listOverview',
              title: m.listOverviewHeader,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 3,
            }),
            buildKeyValueField({
              label: m.listName,
              width: 'full',
              value: ({ answers }) =>
                getValueViaPath(answers, 'list.name') ?? '',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.listLetter,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'list.letter') ?? '',
            }),
            buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'list.nationalId') ?? '',
            }),
            buildDescriptionField({
              id: 'space1',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'applicantOverview',
              title: m.applicantOverviewHeader,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 3,
            }),
            buildKeyValueField({
              label: m.name,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'applicant.name') ?? '',
            }),
            buildKeyValueField({
              label: m.nationalId,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'applicant.nationalId') ?? '',
            }),
            buildDescriptionField({
              id: 'space2',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.phone,
              width: 'half',
              value: ({ answers }) => {
                const phone = getValueViaPath(
                  answers,
                  'applicant.phone',
                ) as string
                return formatPhone(phone) ?? ''
              },
            }),
            buildKeyValueField({
              label: m.email,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'applicant.email') ?? '',
            }),
            buildDescriptionField({
              id: 'space3',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'listsOverview',
              title: m.listsOverviewHeader,
              titleVariant: 'h3',
              space: 'gutter',
            }),
            buildActionCardListField({
              id: 'listsInOverview',
              doesNotRequireAnswer: true,
              items: ({ answers }) => {
                return (answers.constituency as string[]).map(
                  (constituency: string) => ({
                    heading: constituency.split('|')[1],
                    eyebrow: getValueViaPath(answers, 'list.name'),
                    progressMeter: {
                      currentProgress: 0,
                      maxProgress: 350,
                      withLabel: true,
                    },
                  }),
                )
              },
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.createList,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.createList,
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
      title: m.listCreated,
      children: [],
    }),
  ],
})
