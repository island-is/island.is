import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubSection,
} from '../../lib/formBuilders'
import {
  buildCheckboxField,
  buildCustomField,
  buildIntroductionField,
  buildRadioField,
  buildSelectField,
  buildTextField,
} from '../../lib/fieldBuilders'
import { Form } from '../../types/Form'
import { ApplicationTypes } from '../../types/ApplicationTypes'
import { CustomFieldComponents } from '../../types/Fields'
import { DataProviderTypes } from '../../types/DataProvider'

export const ParentalLeaveForm: Form = buildForm({
  id: ApplicationTypes.PARENTAL_LEAVE,
  ownerId: 'DOL',
  name: 'Fæðingarorlof',
  children: [
    buildSection({
      id: 'introduction',
      name: 'Intro',
      children: [
        buildExternalDataProvider({
          name: 'Sækja gögn',
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'expectedDateOfBirth',
              type: DataProviderTypes.ExpectedDateOfBirth,
              source: 'Landlækni',
              subTitle: 'Staðfesting á að það sé yfir höfuð barn á leiðinni',
              title: 'Áætlaður fæðingardagur',
            }),
            buildDataProviderItem({
              id: 'salary',
              type: DataProviderTypes.ExampleSucceeds,
              source: 'Success indeed',
              subTitle:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              title: 'Áætlaður fæðingardagur',
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
      name: 'Reiknivél',
      children: [
        buildSubSection({
          id: 'usage',
          name: 'Ráðstöfun',
          children: [
            buildCustomField(
              {
                id: 'usage',
                name: 'Hvað ætlar þú að nýta þér marga mánuði í fæðingarorlof?',
                required: true,
                component: CustomFieldComponents.PARENTAL_LEAVE_USAGE,
              },
              {},
            ),
          ],
        }),
        buildSubSection({
          id: 'calculations',
          name: 'Útreikningur',
          children: [
            buildCustomField(
              {
                id: 'spread',
                name: '',
                required: true,
                component: CustomFieldComponents.PARENTAL_LEAVE_CALCULATIONS,
              },
              {},
            ),
            buildCustomField(
              {
                id: 'periods',
                name: 'Viltu breyta eða skipta upp tímabilinu?',
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
      name: 'Yfirlit og staðfesting',
      children: [
        buildIntroductionField({
          id: 'todo',
          name: 'Here we need a summary screen',
          introduction: 'very nice',
        }),
      ],
    }),
  ],
})
