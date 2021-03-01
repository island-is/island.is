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
import { parentalLeaveFormMessages } from '../lib/messages'

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
          title: parentalLeaveFormMessages.leavePlan.title,
          component: 'PeriodsRepeater',
          children: [
            buildDateField({
              id: 'startDate',
              title: parentalLeaveFormMessages.startDate.title,
              description: parentalLeaveFormMessages.startDate.description,
              placeholder: parentalLeaveFormMessages.startDate.placeholder,
            }),
            buildMultiField({
              id: 'endDate',
              title: parentalLeaveFormMessages.endDate.title,
              description: parentalLeaveFormMessages.endDate.description,
              children: [
                buildDateField({
                  id: 'endDate',
                  title: parentalLeaveFormMessages.endDate.label,
                  placeholder: parentalLeaveFormMessages.endDate.placeholder,
                }),
              ],
            }),
            // buildCustomField(
            //   {
            //     id: 'endDate',
            //     name: m.duration,
            //     description: parentalLeaveFormMessages.duration.description,
            //     component: 'ParentalLeaveDuration',
            //   },
            //   {
            //     showTimeline: true,
            //   },
            // ),
            buildMultiField({
              id: 'ratio',
              title: parentalLeaveFormMessages.ratio.title,
              description: parentalLeaveFormMessages.ratio.description,
              children: [
                buildSelectField({
                  id: 'ratio',
                  width: 'half',
                  title: parentalLeaveFormMessages.ratio.label,
                  defaultValue: '100',
                  placeholder: parentalLeaveFormMessages.ratio.placeholder,
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
