import {
  buildTextField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildDateField,
  buildKeyValueField,
  buildDividerField,
  buildDescriptionField,
  buildPhoneField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { Application } from '@island.is/application/types'
import { UserProfile } from '@island.is/api/schema'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { parse } from 'libphonenumber-js'

export const form: Form = buildForm({
  id: 'GeneralPetitionForm',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: m.introTitle,
      children: [],
    }),
    buildSection({
      id: 'termsAndConditions',
      title: m.externalDataSectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveTermsAndConditions',
          title: m.externalDataSectionTitle,
          subTitle: m.externalDataSectionSubtitle,
          description: m.externalDataSectionTermsAndConditions,
          checkboxLabel: m.externalDataSectionCheckbox,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'petitionInformation',
      title: m.listInformationTitle,
      children: [
        buildMultiField({
          id: 'list',
          title: m.listInformationTitle,
          space: 2,
          children: [
            buildTextField({
              id: 'listName',
              title: m.listName,
              placeholder: m.listNamePlaceholder,
              variant: 'textarea',
              rows: 1,
              backgroundColor: 'white',
              maxLength: 100,
              defaultValue: () => '',
            }),
            buildTextField({
              id: 'aboutList',
              title: m.aboutList,
              placeholder: m.aboutListPlaceholder,
              variant: 'textarea',
              rows: 5,
              backgroundColor: 'white',
              maxLength: 1000,
              defaultValue: () => '',
            }),
            buildDateField({
              id: 'dates.dateFrom',
              title: m.dateTitle,
              placeholder: m.dateFromPlaceholder,
              width: 'half',
              backgroundColor: 'white',
              minDate: new Date(),
            }),
            buildDateField({
              id: 'dates.dateTil',
              title: m.dateTitle,
              placeholder: m.dateToPlaceholder,
              width: 'half',
              backgroundColor: 'white',
              minDate: new Date(),
              maxDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ),
            }),
            buildDescriptionField({
              id: 'space',
              title: m.listOwner,
              titleVariant: 'h3',
              space: 'containerGutter',
            }),
            buildPhoneField({
              id: 'phone',
              title: m.phone,
              width: 'half',
              backgroundColor: 'white',
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
              id: 'email',
              title: m.email,
              width: 'half',
              backgroundColor: 'white',
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
      id: 'overview',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewTitle,
          description: m.overviewSubtitle,
          space: 3,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'listOwner',
              title: m.overviewApplicant,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: m.name,
              value: ({ externalData }) =>
                (
                  externalData.nationalRegistry?.data as {
                    fullName?: string
                  }
                )?.fullName,
            }),
            buildKeyValueField({
              label: m.phone,
              value: ({ answers }) => {
                const parsedPhoneNumber = parse(answers.phone as string)
                return formatPhoneNumber(parsedPhoneNumber.phone as string)
              },
            }),
            buildKeyValueField({
              label: m.email,
              value: ({ answers }) => answers.email as string,
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'listInfo',
              title: m.applicationName,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: m.listName,
              value: ({ answers }) => answers.listName as string,
            }),
            buildKeyValueField({
              label: m.aboutList,
              value: ({ answers }) => answers.aboutList as string,
            }),
            buildKeyValueField({
              label: m.listPeriod,
              value: ({ answers }) =>
                format(
                  new Date((answers.dates as any).dateFrom as string),
                  'dd. MMMM yyyy',
                  {
                    locale: is,
                  },
                ) +
                ' - ' +
                format(
                  new Date((answers.dates as any).dateTil as string),
                  'dd. MMMM yyyy',
                  {
                    locale: is,
                  },
                ),
            }),
            buildSubmitField({
              id: 'createPetition.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitButton,
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
