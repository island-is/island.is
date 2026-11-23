import { buildExpandableDescriptionField } from '@island.is/application/core'
import { FormText, FormTextWithLocale } from '@island.is/application/types'
import { conclusion as m } from '../lib/messages'

export const buildWhatNextField = ({
  title = m.whatNextHeader,
  introText = m.whatNextIntro,
  description = m.whatNextDescription,
}: {
  title?: FormText
  introText?: FormText
  description?: FormTextWithLocale
} = {}) =>
  buildExpandableDescriptionField({
    id: 'whatNext',
    title,
    introText,
    description,
    startExpanded: false,
    marginTop: 4,
  })
