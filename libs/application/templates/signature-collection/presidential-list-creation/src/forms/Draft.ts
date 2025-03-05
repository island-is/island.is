import {
  buildActionCardListField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildOverviewField,
  buildPhoneField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import {
  Application,
  SignatureCollectionArea,
  UserProfile,
} from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'

import { m } from '../lib/messages'
import format from 'date-fns/format'

export const Draft: Form = buildForm({
  id: 'PresidentialListCreationDraft',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
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
              id: 'applicantHeader',
              title: m.applicantHeader,
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              width: 'full',
              readOnly: true,
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              width: 'full',
              readOnly: true,
              defaultValue: (application: Application) =>
                formatNationalId(application.applicant),
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
            buildDescriptionField({
              id: 'collectionHeader',
              title: m.collectionHeader,
              titleVariant: 'h3',
              space: 'containerGutter',
            }),
            buildTextField({
              id: 'collection.dateFrom',
              title: m.collectionDateFrom,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) => {
                return format(
                  new Date(externalData.currentCollection?.data.startTime),
                  'dd.MM.yy',
                )
              },
            }),
            buildTextField({
              id: 'collection.dateTil',
              title: m.collectionDateTil,
              width: 'half',
              readOnly: true,
              defaultValue: ({ externalData }: Application) => {
                return format(
                  new Date(externalData.currentCollection?.data.endTime),
                  'dd.MM.yy',
                )
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
            buildOverviewField({
              id: 'listOverview',
              title: m.applicantOverviewHeader,
              titleVariant: 'h3',
              marginBottom: 'none',
              items: () => [
                {
                  width: 'half',
                  keyText: m.name,
                  valueText: ({ answers }) =>
                    getValueViaPath(answers, 'applicant.name'),
                },
                {
                  width: 'half',
                  keyText: m.nationalId,
                  valueText: ({ answers }) =>
                    getValueViaPath(answers, 'applicant.nationalId'),
                },
                {
                  width: 'half',
                  keyText: m.phone,
                  valueText: ({ answers }) =>
                    getValueViaPath(answers, 'applicant.phone'),
                },
                {
                  width: 'half',
                  keyText: m.email,
                  valueText: ({ answers }) =>
                    getValueViaPath(answers, 'applicant.email'),
                },
              ],
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'listOverview',
              title: m.listOverviewHeader,
              titleVariant: 'h3',
              space: 'containerGutter',
            }),
            buildActionCardListField({
              id: 'createdLists',
              title: '',
              items: ({ answers, externalData }) => {
                const areas = getValueViaPath(
                  externalData,
                  'currentCollection.data.areas',
                ) as SignatureCollectionArea[]
                return areas?.map((area) => ({
                  heading:
                    getValueViaPath(answers, 'applicant.name') +
                    ' - ' +
                    area.name,
                  eyebrow:
                    m.listDateTil.defaultMessage +
                    ': ' +
                    getValueViaPath(answers, 'collection.dateTil'),
                  progressMeter: {
                    currentProgress: 0,
                    maxProgress: area.max ?? 0,
                    withLabel: true,
                  },
                }))
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
