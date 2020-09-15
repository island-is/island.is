import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
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
        // TODO REMOVE THIS MULTIFIELD BEFORE MERGING
        buildMultiField({
          id: 'test',
          name: 'sick',
          children: [
            buildRadioField({
              id: 'test.a',
              name:
                'question 1 is very long so long lets see how long it truly is really right? Lets have it so wide that it breaks the 4th barrier',

              width: 'half',
              options: [
                { value: 'yaaaaa', label: 'YES' },
                { value: 'nooooo', label: 'NO' },
                { value: 'noooooaaaa', label: 'or what' },
              ],
            }),
            buildCheckboxField({
              id: 'test.a',
              name:
                'question 2 is even longer right? So long indeed, should we just do something weird???? Lets see how long it truly is really right? Lets have it so wide that it breaks the 4th barrier',

              width: 'half',
              options: [
                { value: 'yaaaaa', label: 'YES' },
                { value: 'nooooo', label: 'NO' },
                { value: 'noooooaaaa', label: 'or what' },
                { value: 'a', label: 'komaso' },
                { value: 's', label: 'testing' },
              ],
            }),
            buildSelectField({
              id: 'test.a',
              name:
                'question 2 is even longer right? So long indeed, should we just do something weird???? Lets see how long it truly is really right? Lets have it so wide that it breaks the 4th barrier',

              width: 'half',
              options: [
                { value: 'yaaaaa', label: 'YES' },
                { value: 'nooooo', label: 'NO' },
                { value: 'noooooaaaa', label: 'or what' },
                { value: 'a', label: 'komaso' },
                { value: 's', label: 'testing' },
              ],
            }),
            buildTextField({
              id: 'test.c',
              name: 'question 3',

              width: 'half',
            }),
            buildTextField({ id: 'test.b', name: 'question 2', width: 'half' }),
            buildTextField({ id: 'test.d', name: 'question 4', width: 'half' }),
            buildTextField({ id: 'test.e', name: 'question 5', width: 'half' }),
          ],
        }),
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
