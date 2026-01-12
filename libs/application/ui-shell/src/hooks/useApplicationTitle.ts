import { useLocale } from '@island.is/localization'
import {
  formatTextWithLocale,
  getSubSectionsInSection,
} from '@island.is/application/core'
import { Section, SubSection } from '@island.is/application/types'
import { FormatMessage } from '@island.is/localization'

import { ApplicationUIState } from '../reducer/ReducerTypes'
import { useDocumentTitle } from './useDocumentTitle'
import { Locale } from '@island.is/shared/types'

export const getApplicationTitle = (
  state: ApplicationUIState,
  locale: Locale,
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

  const formName = formatMessage(state.form.title ?? '')
  const titleParts = [`${formName} | Ísland.is`]

  if (activeSection) {
    const tabTitle = activeSection.tabTitle
    const title = activeSection.title ?? ''
    const sectionTitle = formatTextWithLocale(
      tabTitle || title,
      state.application,
      locale as Locale,
      formatMessage,
    )

    titleParts.unshift(sectionTitle)
  }

  return titleParts.join(' - ')
}

export const useApplicationTitle = (state: ApplicationUIState) => {
  const { formatMessage, lang: locale } = useLocale()
  const applicationTitle = getApplicationTitle(
    state,
    locale as Locale,
    formatMessage,
  )

  useDocumentTitle(applicationTitle)
}
