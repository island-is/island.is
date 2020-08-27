import * as z from 'zod'
import { buildForm, buildSection, buildSubSection } from '../lib/formBuilders'
import { buildCustomField, buildIntroductionField } from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import { FormType } from './FormType'
import { CustomFieldComponents } from '../types/Fields'

const schema = z.object({
  usage: z
    .number()
    .min(0)
    .max(6),
  spread: z.number().max(24),
  periods: z.array(
    z.object({
      start: z.date(),
      end: z.date(),
      ratio: z
        .number()
        .min(1)
        .max(100),
    }),
  ),
})

export const PaternityLeave: Form = buildForm({
  id: FormType.PATERNITY_LEAVE,
  ownerId: 'DOL',
  name: 'Fæðingarorlof',
  schema: schema,
  children: [
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
                component: CustomFieldComponents.PATERNITY_LEAVE_USAGE,
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
                component: CustomFieldComponents.PATERNITY_LEAVE_CALCULATIONS,
              },
              {},
            ),
            buildCustomField(
              {
                id: 'periods',
                name: 'Viltu breyta eða skipta upp tímabilinu?',
                component: CustomFieldComponents.PATERNITY_LEAVE_CALCULATIONS,
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
