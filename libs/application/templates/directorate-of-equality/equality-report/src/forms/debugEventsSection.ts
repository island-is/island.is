import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

// TEMPORARY — for locally testing state transitions. Delete before committing.
export const buildDebugEventsSection = () =>
  buildSection({
    id: 'debugEvents',
    title: 'DEBUG',
    tabTitle: 'DEBUG',
    children: [
      buildMultiField({
        id: 'debugEventsMultiField',
        title: 'DEBUG — fire event',
        children: [
          buildCustomField({
            id: 'debugEventButtons',
            title: '',
            component: 'DebugEventButtons',
          }),
        ],
      }),
    ],
  })
