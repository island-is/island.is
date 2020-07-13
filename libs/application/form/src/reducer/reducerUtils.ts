import {
  Field,
  findSectionIndexForScreen,
  findSubSectionIndexForScreen,
  FormItemTypes,
  FormLeaf,
  FormValue,
  getSubSectionsInSection,
  shouldShowField,
} from '@island.is/application/schema'
import { ApplicationUIState } from './ReducerTypes'
import { FieldDef, FormScreen, MultiFieldScreen } from '../types'

export const moveToScreen = (
  state: ApplicationUIState,
  screenIndex: number,
): ApplicationUIState => {
  const { activeScreen, form, sections, screens } = state

  if (screenIndex < 0) {
    return { ...state, activeScreen: 0, activeSection: 0, activeSubSection: 0 }
  }
  if (screenIndex === screens.length) {
    const subSections = getSubSectionsInSection(sections[sections.length - 1])
    return {
      ...state,
      activeScreen: screens.length - 1,
      activeSection: sections.length - 1,
      activeSubSection: subSections.length ? subSections.length - 1 : 0,
    }
  }

  const screen = screens[screenIndex]
  if (!screen.isVisible) {
    if (activeScreen < screenIndex) {
      // skip this screen and go to the next one
      return moveToScreen(state, screenIndex + 1)
    }
    return moveToScreen(state, screenIndex - 1)
  }
  const sectionIndexForScreen = findSectionIndexForScreen(form, screen)

  const subSectionIndexForScreen = findSubSectionIndexForScreen(
    sections[sectionIndexForScreen],
    screen,
  )

  return {
    ...state,
    activeScreen: screenIndex,
    activeSection: sectionIndexForScreen,
    activeSubSection: subSectionIndexForScreen,
  }
}
export function applyConditionsToFormField(
  leaf: FormLeaf,
  formValue: FormValue,
): FormScreen {
  if (leaf.type === FormItemTypes.MULTI_FIELD) {
    let isMultiFieldVisible = false
    const children = []
    leaf.children.forEach((field) => {
      const isFieldVisible = shouldShowField(field, formValue)
      if (isFieldVisible) {
        isMultiFieldVisible = true
      }
      children.push({ ...field, isVisible: isFieldVisible })
    })
    return {
      ...leaf,
      isVisible: isMultiFieldVisible,
      children,
    } as MultiFieldScreen
  }
  return {
    ...leaf,
    isVisible: shouldShowField(leaf as Field, formValue), // todo support repeateres
  } as FieldDef
}

export function applyConditionsToFormFields(
  formLeaves: FormLeaf[],
  formValue: FormValue,
): FormScreen[] {
  return formLeaves.map((leaf) => applyConditionsToFormField(leaf, formValue))
}
