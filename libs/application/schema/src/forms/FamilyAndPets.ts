import * as z from 'zod'
import { buildForm, buildRepeater, buildSection } from '../lib/formBuilders'
import { buildIntroductionField, buildTextField } from '../lib/fieldBuilders'
import { Form } from '../types/Form'
import { FormType } from './FormType'

const FamilyAndPetsSchema = z.object({
  person: z
    .array(
      z.object({
        age: z.string().refine((x) => {
          const asNumber = parseInt(x)
          if (isNaN(asNumber)) {
            return false
          }
          return asNumber > 15
        }),
        name: z
          .string()
          .nonempty()
          .max(256), // unique in the repeater hmm?
        pets: z
          .array(
            z.object({
              name: z.string(),
              animal: z.enum(['cat', 'dog', 'parrot', 'snake']),
            }),
          )
          .optional(),
      }),
    )
    .max(5)
    .nonempty(),
  familyName: z.string().nonempty(),
})

export const FamilyAndPets: Form = buildForm({
  id: FormType.FAMILY_AND_PETS,
  ownerId: 'Aranja',
  name: 'Family and pets',
  schema: FamilyAndPetsSchema,
  children: [
    buildSection({
      id: 'family',
      name: 'Family',
      children: [
        buildIntroductionField({
          id: 'welcome',
          name: 'Welcome to this amazing application form',
          introduction: 'This will be one hell of a ride',
        }),
        buildRepeater({
          id: 'person',
          name: 'Family Member',
          labelKey: 'name',
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
            // buildRepeater({
            //   id: 'person.pets',
            //   name: 'Pets',
            //   children: [
            //     buildTextField({
            //       id: 'name',
            //       name: 'Name',
            //       required: true,
            //     }),
            //     buildSelectField({
            //       id: 'animal',
            //       name: 'Animal Type',
            //       required: true,
            //       options: [
            //         { value: 'cat', label: 'Cat' },
            //         { value: 'dog', label: 'Dog' },
            //         { value: 'parrot', label: 'Parrot' },
            //         { value: 'snake', label: 'Snake' },
            //       ],
            //     }),
            //   ],
            // }),
          ],
        }),
        buildTextField({ id: 'familyName', name: 'What is the family name?' }),
      ],
    }),
  ],
})
