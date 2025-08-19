import {
  FormSystemScreen,
  FormSystemSection,
  Maybe,
} from '@island.is/api/schema'

export const isVisible = (x?: { isHidden?: Maybe<boolean> } | null): boolean =>
  !!x && x.isHidden !== true

export const nextVisibleIndex = <T>(
  arr: readonly (T | null | undefined)[] = [],
  afterIndex: number,
  predicate: (t: T) => boolean,
): number => {
  for (let i = Math.max(afterIndex + 1, 0); i < arr.length; i++) {
    const item = arr[i]
    if (item != null && predicate(item)) return i
  }
  return -1
}

export const prevVisibleIndex = <T>(
  arr: readonly (T | null | undefined)[] = [],
  beforeIndex: number,
  predicate: (t: T) => boolean,
): number => {
  for (let i = Math.min(beforeIndex - 1, arr.length - 1); i >= 0; i--) {
    const item = arr[i]
    if (item != null && predicate(item)) return i
  }
  return -1
}

export const firstVisibleIndex = <T>(
  arr: readonly (T | null | undefined)[] = [],
  predicate: (t: T) => boolean,
): number => {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (item != null && predicate(item)) return i
  }
  return -1
}

export const lastVisibleIndex = <T>(
  arr: readonly (T | null | undefined)[] = [],
  predicate: (t: T) => boolean,
): number => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i]
    if (item != null && predicate(item)) return i
  }
  return -1
}

export const nextVisibleSectionIndex = (
  sections:
    | ReadonlyArray<FormSystemSection | null | undefined>
    | null
    | undefined,
  currentSectionIndex: number,
): number => nextVisibleIndex(sections ?? [], currentSectionIndex, isVisible)

export const prevVisibleSectionIndex = (
  sections:
    | ReadonlyArray<FormSystemSection | null | undefined>
    | null
    | undefined,
  currentSectionIndex: number,
): number => prevVisibleIndex(sections ?? [], currentSectionIndex, isVisible)

export const firstVisibleScreenIndex = (
  screens:
    | ReadonlyArray<FormSystemScreen | null | undefined>
    | null
    | undefined,
): number => firstVisibleIndex(screens ?? [], isVisible)

export const lastVisibleScreenIndex = (
  screens:
    | ReadonlyArray<FormSystemScreen | null | undefined>
    | null
    | undefined,
): number => lastVisibleIndex(screens ?? [], isVisible)

export const nextVisibleScreenInSection = (
  section: FormSystemSection | undefined,
  currentScreenIndex = -1,
): number =>
  nextVisibleIndex(section?.screens ?? [], currentScreenIndex, isVisible)

export const prevVisibleScreenInSection = (
  section: FormSystemSection | undefined,
  currentScreenIndex: number,
): number =>
  prevVisibleIndex(section?.screens ?? [], currentScreenIndex, isVisible)

export const hasScreens = (section: FormSystemSection): boolean =>
  Array.isArray(section.screens) &&
  (section.screens as Array<FormSystemScreen | null | undefined>).some(
    isVisible,
  )
