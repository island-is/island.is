import { useLocale } from '@island.is/localization'
import {
  formatText,
  getSubSectionsInSection,
} from '@island.is/application/core'
import { Section, SubSection } from '@island.is/application/types'
import { FormatMessage } from '@island.is/localization'

import { ApplicationUIState } from '../reducer/ReducerTypes'
import { useDocumentTitle } from './useDocumentTitle'

export const getApplicationTitle = (
  state: ApplicationUIState,
  formatMessage: FormatMessage,
) => {
  const activeScreen = state.screens[state.activeScreen]
  let activeSection: Section | SubSection =
    state.sections[activeScreen.sectionIndex]

  if (activeSection && activeScreen.subSectionIndex >= 0) {
    activeSection = getSubSectionsInSection(
      activeSection,
      state.application.answers,
      state.application.externalData,
      state.user,
    )[activeScreen.subSectionIndex]
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
