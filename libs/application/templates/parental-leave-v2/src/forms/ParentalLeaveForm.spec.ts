import { Field, FormNode } from '@island.is/application/types'
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
})
