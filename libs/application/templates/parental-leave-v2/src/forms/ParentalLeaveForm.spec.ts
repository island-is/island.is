import { Field, FormItemTypes, FormNode } from '@island.is/application/types'
import { EditOrAddEmployersAndPeriods } from './EditOrAddEmployersAndPeriods'
import { ParentalLeaveForm } from './ParentalLeaveForm'

const findField = (node: FormNode, id: string): Field | undefined => {
  const children = (node as { children?: FormNode[] }).children ?? []
  if ((node as Field).id === id && children.length === 0) {
    return node as Field
  }

  for (const child of children) {
    const found = findField(child, id)
    if (found) {
      return found
    }
  }

  return undefined
}

const findParent = (node: FormNode, id: string): FormNode | undefined => {
  const children = (node as { children?: FormNode[] }).children ?? []
  for (const child of children) {
    if ((child as Field).id === id) {
      return node
    }
    const found = findParent(child, id)
    if (found) {
      return found
    }
  }

  return undefined
}

const containers: string[] = [
  FormItemTypes.FORM,
  FormItemTypes.SECTION,
  FormItemTypes.SUB_SECTION,
]
const screenTypes: string[] = [
  FormItemTypes.MULTI_FIELD,
  FormItemTypes.REPEATER,
  FormItemTypes.EXTERNAL_DATA_PROVIDER,
]

const findBareFieldScreens = (node: FormNode): string[] =>
  ((node as { children?: FormNode[] }).children ?? []).flatMap((child) => {
    if (containers.includes(child.type)) {
      return findBareFieldScreens(child)
    }
    return screenTypes.includes(child.type) ? [] : [String(child.id)]
  })

describe('ParentalLeaveForm', () => {
  it('should clear the manually entered other parent when another option is picked', () => {
    const chooseOtherParent = findField(
      ParentalLeaveForm,
      'otherParentObj.chooseOtherParent',
    )

    expect(chooseOtherParent?.clearOnChange).toEqual([
      'otherParentObj.otherParentName',
      'otherParentObj.otherParentId',
    ])
  })

  // A bare field screen is validated against every answer, so unsaved answers
  // left behind by going back, e.g. from the payments screen, blocked "Next".
  it.each([
    ['apply', ParentalLeaveForm],
    ['edit', EditOrAddEmployersAndPeriods],
  ])('should only have multi-field screens in the %s form', (_, form) => {
    expect(findBareFieldScreens(form)).toEqual([])
  })

  it.each([
    ['apply', ParentalLeaveForm],
    ['edit', EditOrAddEmployersAndPeriods],
  ])(
    'should ask for right of access on a multi-field screen in the %s form',
    (_, form) => {
      expect(findParent(form, 'otherParentRightOfAccess')?.type).toBe(
        FormItemTypes.MULTI_FIELD,
      )
    },
  )
})
