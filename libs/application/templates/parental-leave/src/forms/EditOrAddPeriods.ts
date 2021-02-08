import {
  buildDateField,
  buildForm,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildSelectField,
  Form,
  FormModes,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { mm } from '../lib/messages'

export const EditOrAddPeriods: Form = buildForm({
  id: 'ParentalLeaveEditOrAddPeriods',
  title: 'Edit or add periods',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'editOrAddPeropds',
      title: '',
      children: [
        // Copied from ParentalLeaveForm.ts line 606
        buildRepeater({
          id: 'periods',
          title: mm.leavePlan.title,
          component: 'PeriodsRepeater',
          children: [
            buildDateField({
              id: 'startDate',
              title: mm.startDate.title,
              description: mm.startDate.description,
              placeholder: mm.startDate.placeholder,
            }),
            buildMultiField({
              id: 'endDate',
              title: mm.endDate.title,
              description: mm.endDate.description,
              children: [
                buildDateField({
                  id: 'endDate',
                  title: mm.endDate.label,
                  placeholder: mm.endDate.placeholder,
                }),
              ],
            }),
            // buildCustomField(
            //   {
            //     id: 'endDate',
            //     name: m.duration,
            //     description: mm.duration.description,
            //     component: 'ParentalLeaveDuration',
            //   },
            //   {
            //     showTimeline: true,
            //   },
            // ),
            buildMultiField({
              id: 'ratio',
              title: mm.ratio.title,
              description: mm.ratio.description,
              children: [
                buildSelectField({
                  id: 'ratio',
                  width: 'half',
                  title: mm.ratio.label,
                  defaultValue: '100',
                  placeholder: mm.ratio.placeholder,
                  options: [
                    { label: '100%', value: '100' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
