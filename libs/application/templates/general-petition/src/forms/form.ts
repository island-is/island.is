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
  getValueViaPath,
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
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { getExcludedDates } from '../lib/generalPetitionUtils'
import addMonths from 'date-fns/addMonths'

export const form: Form = buildForm({
  id: 'GeneralPetitionForm',
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
            //fake field to trigger rerender on date switch
            buildDescriptionField({
              id: 'fake_helper_field',
              condition: (answers) =>
                !!getValueViaPath(answers, 'dates.dateFrom'),
            }),
            buildDateField({
              id: 'dates.dateFrom',
              title: m.dateTitle,
              placeholder: m.dateFromPlaceholder,
              width: 'half',
              backgroundColor: 'white',
              minDate: new Date(),
              excludeDates: getExcludedDates(),
            }),
            buildDateField({
              id: 'dates.dateTil',
              title: m.dateTitle,
              placeholder: m.dateToPlaceholder,
              width: 'half',
              backgroundColor: 'white',
              minDate: new Date(),
              maxDate: ({ answers }) => {
                const dateFrom =
                  getValueViaPath<string>(answers, 'dates.dateFrom') ?? ''
                return addMonths(new Date(dateFrom), 3)
              },
              excludeDates: getExcludedDates(),
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
                  getValueViaPath<string>(
                    application.externalData,
                    'userProfile.data.mobilePhoneNumber',
                  ) ?? ''

                return phone
              },
            }),
            buildTextField({
              id: 'email',
              title: m.email,
              width: 'half',
              backgroundColor: 'white',
              defaultValue: ({ externalData }: Application) => {
                const email = getValueViaPath<string>(
                  externalData,
                  'userProfile.data.email',
                )
                return email ?? ''
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
                getValueViaPath<string>(
                  externalData,
                  'nationalRegistry.data.fullName',
                ),
            }),
            buildKeyValueField({
              label: m.phone,
              value: ({ answers }) => {
                const parsedPhoneNumber = parsePhoneNumberFromString(
                  getValueViaPath<string>(answers, 'phone') ?? '',
                )
                return formatPhoneNumber(
                  parsedPhoneNumber?.nationalNumber?.toString() || '',
                )
              },
            }),
            buildKeyValueField({
              label: m.email,
              value: ({ answers }) =>
                getValueViaPath<string>(answers, 'email') ?? '',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'listInfo',
              title: m.applicationName,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: m.listName,
              value: ({ answers }) =>
                getValueViaPath<string>(answers, 'listName') ?? '',
            }),
            buildKeyValueField({
              label: m.aboutList,
              value: ({ answers }) =>
                getValueViaPath<string>(answers, 'aboutList') ?? '',
            }),
            buildKeyValueField({
              label: m.listPeriod,
              value: ({ answers }) =>
                format(
                  new Date(
                    getValueViaPath<string>(answers, 'dates.dateFrom') ?? '',
                  ),
                  'dd. MMMM yyyy',
                  {
                    locale: is,
                  },
                ) +
                ' - ' +
                format(
                  new Date(
                    getValueViaPath<string>(answers, 'dates.dateTil') ?? '',
                  ),
                  'dd. MMMM yyyy',
                  {
                    locale: is,
                  },
                ),
            }),
            buildSubmitField({
              id: 'createPetition.submit',
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
