import * as z from 'zod'
import { buildForm, buildRepeater, buildSection } from '../lib/formBuilders'
import {
  buildIntroductionField,
  buildRadioField,
  buildSelectField,
  buildTextField,
} from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import { FormType } from './FormType'

const PetsSchema = z.object({
  entrance: z.enum(['yes', 'no']),
  pets: z
    .array(
      z.object({
        age: z.string().refine((x) => {
          const asNumber = parseInt(x)
          if (isNaN(asNumber)) {
            return false
          }
          return asNumber >= 0
        }),
        name: z
          .string()
          .nonempty()
          .max(256), // unique in the repeater hmm?
        kind: z.enum(['cat', 'dog', 'parrot', 'snake']),
      }),
    )
    .max(5)
    .nonempty(),
  familyName: z.string().nonempty(),
})

export const FamilyAndPets: Form = buildForm({
  id: FormType.FAMILY_AND_PETS,
  ownerId: 'Aranja',
  name: 'Gæludýr',
  schema: PetsSchema,
  children: [
    buildSection({
      id: 'pets',
      name: 'Almennt um gæludýr',
      children: [
        buildIntroductionField({
          id: 'welcome',
          name: 'Velkomin í þessa umsókn um skráningu gæludýra',
          introduction:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        }),
        buildRadioField({
          id: 'ownPets',
          name: 'Áttu gæludýr?',
          options: [
            { label: 'Já', value: 'yes' },
            { label: 'Nei', value: 'no' },
          ],
        }),
        buildRepeater({
          id: 'pets',
          name: 'Hvaða gæludýr áttu?',
          labelKey: 'name',
          condition: (formValue) => formValue?.ownPets === 'yes',
          children: [
            buildTextField({
              id: 'name',
              name: 'Name',
              required: true,
            }),
            buildTextField({
              id: 'age',
              name: 'Age',
              required: true,
            }),
            buildSelectField({
              id: 'kind',
              name: 'Hvaða dýrategund er gæludýrið?',
              required: true,
              options: [
                { value: 'cat', label: 'Köttur' },
                { value: 'dog', label: 'Hundur' },
                { value: 'snake', label: 'Snákur' },
                { value: 'parrot', label: 'Páfagaukur' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'houseInfo',
      name: 'Húsnæði',
      children: [
        buildRadioField({
          id: 'entrance',
          name: 'Eru þið með sérinngang í húsnæði ykkar?',
          options: [
            { label: 'Já', value: 'yes' },
            { label: 'Nei', value: 'no' },
          ],
        }),
        buildTextField({
          id: 'floor',
          name: 'Á hvaða hæð er húsnæðið þitt (ef á við)',
        }),
        buildIntroductionField({
          id: 'summary',
          name: 'Takk fyrir',
          introduction: 'Við verðum í sambandi síðar',
        }),
      ],
    }),
  ],
})
