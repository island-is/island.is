import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { Application } from '@island.is/api/schema'
import { sections } from '../../../lib/messages/sections'

export const aboutSection = buildSubSection({
  id: 'about',
  title: sections.draft.about,
  children: [],
})
