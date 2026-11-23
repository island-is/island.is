import { buildSection } from '@island.is/application/core'
import { sections } from '../lib/messages'

/**
 * Empty sections that keep the same four steps in the stepper on every form
 * (Gagnaöflun, Persónuupplýsingar, Starfsferill, Niðurstaða).
 */
export const externalDataStubSection = buildSection({
  id: 'externalDataStub',
  title: sections.externalData,
  children: [],
})

export const personalInformationStubSection = buildSection({
  id: 'personalInformationStub',
  title: sections.personalInformation,
  children: [],
})

export const employmentHistoryStubSection = buildSection({
  id: 'employmentHistoryStub',
  title: sections.employmentHistory,
  children: [],
})

export const conclusionStubSection = buildSection({
  id: 'conclusionStub',
  title: sections.conclusion,
  children: [],
})
