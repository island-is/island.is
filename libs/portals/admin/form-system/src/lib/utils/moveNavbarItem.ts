import { arrayMove } from '@dnd-kit/sortable'
import {
  FormSystemField,
  FormSystemForm,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'

export type NavbarDrop =
  | {
      activeType: 'Section'
      overType: 'Section'
      activeId: string
      overId: string
    }
  | {
      activeType: 'Screen'
      overType: 'Section' | 'Screen' | 'ClosedSection'
      activeId: string
      overId: string
    }
  | {
      activeType: 'Field'
      overType: 'Screen' | 'Field' | 'ClosedScreen'
      activeId: string
      overId: string
    }

const moveFieldToScreen = (
  fields: FormSystemField[],
  activeId: string,
  screenId: string,
  beforeFieldId?: string,
) => {
  const activeField = fields.find((field) => field.id === activeId)

  if (!activeField) {
    return fields
  }

  const remainingFields = fields.filter((field) => field.id !== activeId)
  const movedField = {
    ...activeField,
    screenId,
  }

  if (beforeFieldId) {
    const beforeIndex = remainingFields.findIndex(
      (field) => field.id === beforeFieldId,
    )

    if (beforeIndex >= 0) {
      return [
        ...remainingFields.slice(0, beforeIndex),
        movedField,
        ...remainingFields.slice(beforeIndex),
      ]
    }
  }

  const lastFieldInTargetScreenIndex = remainingFields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => field.screenId === screenId)
    .at(-1)?.index

  if (lastFieldInTargetScreenIndex === undefined) {
    return [...remainingFields, movedField]
  }

  return [
    ...remainingFields.slice(0, lastFieldInTargetScreenIndex + 1),
    movedField,
    ...remainingFields.slice(lastFieldInTargetScreenIndex + 1),
  ]
}

const moveScreenToSection = (
  screens: FormSystemScreen[],
  activeId: string,
  sectionId: string,
  beforeScreenId?: string,
) => {
  const activeScreen = screens.find((screen) => screen.id === activeId)

  if (!activeScreen) {
    return screens
  }

  const remainingScreens = screens.filter((screen) => screen.id !== activeId)
  const movedScreen = {
    ...activeScreen,
    sectionId,
  }

  if (beforeScreenId) {
    const beforeIndex = remainingScreens.findIndex(
      (screen) => screen.id === beforeScreenId,
    )

    if (beforeIndex >= 0) {
      return [
        ...remainingScreens.slice(0, beforeIndex),
        movedScreen,
        ...remainingScreens.slice(beforeIndex),
      ]
    }
  }

  const lastScreenInTargetSectionIndex = remainingScreens
    .map((screen, index) => ({ screen, index }))
    .filter(({ screen }) => screen.sectionId === sectionId)
    .at(-1)?.index

  if (lastScreenInTargetSectionIndex === undefined) {
    return [...remainingScreens, movedScreen]
  }

  return [
    ...remainingScreens.slice(0, lastScreenInTargetSectionIndex + 1),
    movedScreen,
    ...remainingScreens.slice(lastScreenInTargetSectionIndex + 1),
  ]
}

export const moveNavbarItem = (
  form: FormSystemForm,
  drop: NavbarDrop,
): FormSystemForm => {
  const sections = (form.sections ?? []).filter(Boolean) as FormSystemSection[]
  const screens = (form.screens ?? []).filter(Boolean) as FormSystemScreen[]
  const fields = (form.fields ?? []).filter(Boolean) as FormSystemField[]

  if (drop.activeType === 'Section' && drop.overType === 'Section') {
    const activeIndex = sections.findIndex(
      (section) => section.id === drop.activeId,
    )
    const overIndex = sections.findIndex(
      (section) => section.id === drop.overId,
    )

    if (activeIndex < 0 || overIndex < 0) {
      return form
    }

    return {
      ...form,
      sections: arrayMove(sections, activeIndex, overIndex),
    }
  }

  if (drop.activeType === 'Screen') {
    if (drop.overType === 'Section' || drop.overType === 'ClosedSection') {
      return {
        ...form,
        screens: moveScreenToSection(screens, drop.activeId, drop.overId),
      }
    }

    if (drop.overType === 'Screen') {
      const overScreen = screens.find((screen) => screen.id === drop.overId)

      if (!overScreen?.sectionId) {
        return form
      }

      return {
        ...form,
        screens: moveScreenToSection(
          screens,
          drop.activeId,
          overScreen.sectionId,
          drop.overId,
        ),
      }
    }
  }

  if (drop.activeType === 'Field') {
    if (drop.overType === 'Screen' || drop.overType === 'ClosedScreen') {
      return {
        ...form,
        fields: moveFieldToScreen(fields, drop.activeId, drop.overId),
      }
    }

    if (drop.overType === 'Field') {
      const overField = fields.find((field) => field.id === drop.overId)

      if (!overField?.screenId) {
        return form
      }

      return {
        ...form,
        fields: moveFieldToScreen(
          fields,
          drop.activeId,
          overField.screenId,
          drop.overId,
        ),
      }
    }
  }

  return form
}
