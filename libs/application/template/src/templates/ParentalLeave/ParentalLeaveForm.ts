import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubSection,
} from '../../lib/formBuilders'
import {
  buildCustomField,
  buildIntroductionField,
} from '../../lib/fieldBuilders'
import { Form } from '../../types/Form'
import { ApplicationTypes } from '../../types/ApplicationTypes'
import { CustomFieldComponents } from '../../types/Fields'
import { DataProviderTypes } from '../../types/DataProvider'
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
                component: CustomFieldComponents.PARENTAL_LEAVE_USAGE,
              },
              {},
            ),
          ],
        }),
        buildSubSection({
          id: 'calculations',
          name: m.calculationsSubsection,
          children: [
            buildCustomField(
              {
                id: 'spread',
                name: m.spread,
                required: true,
                component: CustomFieldComponents.PARENTAL_LEAVE_CALCULATIONS,
              },
              {},
            ),
            buildCustomField(
              {
                id: 'periods',
                name: m.periods,
                component: CustomFieldComponents.PARENTAL_LEAVE_CALCULATIONS,
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
