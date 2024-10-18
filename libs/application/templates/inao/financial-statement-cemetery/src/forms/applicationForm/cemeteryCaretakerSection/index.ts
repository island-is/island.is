import { buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { caretakerMultiField } from './caretakerMultiField'

export const cemeteryCaretekerSection = buildSection({
  id: 'cemeteryCaretekerSection',
  title: m.cemeteryCaretakers,
  children: [caretakerMultiField],
})
