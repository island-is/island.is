import { ApplicationUIState } from '../reducer/ReducerTypes'
import useDocumentTitle from '@rehooks/document-title'
import { useLocale } from '../../../../localization/src/lib/useLocale'
import {
  formatText,
  getSubSectionsInSection,
  Section,
  SubSection,
} from '@island.is/application/core'
import { MessageDescriptor } from 'react-intl'

type FormatMessage = (
  descriptor: MessageDescriptor | string,
  values?: any,
) => string

export const getApplicationTitle = (
  state: ApplicationUIState,
  formatMessage: FormatMessage,
) => {
  const activeScreen = state.screens[state.activeScreen]
  let activeSection: Section | SubSection =
    state.sections[activeScreen.sectionIndex]
  if (activeSection && activeScreen.subSectionIndex >= 0) {
    activeSection = getSubSectionsInSection(activeSection)[
      activeScreen.subSectionIndex
    ]
  }

  const formName = formatMessage(state.form.title)
  const titleParts = [`${formName} | Ísland.is`]
  if (activeSection) {
    const sectionTitle = formatText(
      activeSection.title,
      state.application,
      formatMessage,
    )
    titleParts.unshift(sectionTitle)
  }

  return titleParts.join(' - ')
}

export const useApplicationTitle = (state: ApplicationUIState) => {
  const { formatMessage } = useLocale()
  const applicationTitle = getApplicationTitle(state, formatMessage)

  useDocumentTitle(applicationTitle)
}
