import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubSection,
  buildCustomField,
  buildIntroductionField,
  Form,
  ApplicationTypes,
  DataProviderTypes,
  buildRadioField,
} from '@island.is/application/core'
import { m } from './messages'

export const ParentalLeaveForm: Form = buildForm({
  id: ApplicationTypes.PARENTAL_LEAVE,
  ownerId: 'DOL',
  name: 'Fæðingarorlof',
  children: [
    buildSection({
      id: 'introduction',
      name: m.introductionSection,
      children: [
        buildExternalDataProvider({
          name: m.introductionProvider,
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'expectedDateOfBirth',
              type: DataProviderTypes.ExpectedDateOfBirth,
              source: 'Landlækni',
              title: m.expectedDateOfBirthTitle,
              subTitle: m.expectedDateOfBirthSubtitle,
            }),
            buildDataProviderItem({
              id: 'salary',
              type: DataProviderTypes.ExampleSucceeds,
              source: 'Success indeed',
              title: m.salaryTitle,
              subTitle: m.salarySubtitle,
            }),
            // buildDataProviderItem({
            //   id: 'willFail',
            //   type: DataProviderTypes.ExampleFails,
            //   source: 'Failure',
            //   subTitle: 'what is happening',
            //   title: 'Fail me please',
            // }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'calculator',
      name: m.calculatorSection,
      children: [
        buildSubSection({
          id: 'usage',
          name: m.usageSubsection,
          children: [
            buildCustomField(
              {
                id: 'usage',
                name: m.usage,
                required: true,
                component: 'ParentalLeaveUsage',
              },
              {},
            ),
            buildRadioField({
              id: 'start',
              name: m.startDateTitle,
              description: m.startDateDescription,
              required: true,
              emphasize: true,
              options: [
                {
                  value: 'dob',
                  label: m.startDateOption1,
                },
                {
                  value: 'customDate',
                  label: m.startDateOption2,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'duration',
          name: m.durationSubsection,
          children: [
            buildCustomField(
              {
                id: 'duration',
                name: m.duration,
                description: m.durationDescription,
                required: true,
                component: 'ParentalLeaveDuration',
              },
              {},
            ),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'summary',
      name: m.summarySection,
      children: [
        buildIntroductionField({
          id: 'todo',
          name: m.summaryName,
          introduction: m.summaryIntro,
        }),
      ],
    }),
  ],
})
