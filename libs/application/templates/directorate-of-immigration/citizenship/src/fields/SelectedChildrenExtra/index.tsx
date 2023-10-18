import { FC, useEffect, useState } from 'react'
import { ChildrenOfApplicant } from '../../shared'
import { NO, YES, getValueViaPath } from '@island.is/application/core'
import { SelectedRepeaterItem } from './SelectedRepeaterItem'
import { getSelectedCustodyChild } from '../../utils'
import { FieldBaseProps } from '@island.is/application/types'

const initialCombinedChild = {
  hasFullCustody: YES,
  otherParentNationalId: '',
  otherParentBirtDate: '',
  otherParentName: '',
  wasRemoved: 'false',
}

export const MoreChildInfo: FC<FieldBaseProps> = (props) => {
  const { application } = props
  const { answers, externalData } = application
  const [readOnlyFields, setReadOnlyFields] = useState(false)

  const [combinedChildren, setCombinedChildren] = useState<
    Array<ChildrenOfApplicant>
  >([])

  const [children] = useState<string[]>(
    getValueViaPath(answers, 'selectedChildren', []) as string[],
  )

  const [childrenExtraData] = useState<ChildrenOfApplicant[]>(
    getValueViaPath(
      answers,
      'selectedChildrenExtraData',
      [],
    ) as ChildrenOfApplicant[],
  )

  useEffect(() => {
    const mappedChildren = children.map((child, index) => {
      const childCustodyData = getSelectedCustodyChild(
        externalData,
        answers,
        index,
      )
      const predefinedChild: ChildrenOfApplicant = {
        nationalId: child,
        ...initialCombinedChild,
      }
      const foundInExtra = childrenExtraData.find((x) => x.nationalId === child)
      //found custody data, that takes priority
      if (childCustodyData?.otherParent) {
        setReadOnlyFields(true)
        return {
          nationalId: child,
          otherParentBirtDate: '',
          otherParentNationalId: childCustodyData.otherParent?.nationalId,
          otherParentName: childCustodyData.otherParent?.fullName,
          hasFullCustody: NO,
          wasRemoved: 'false',
        }
      }
      //found already filled in data
      else if (foundInExtra) {
        return foundInExtra ? foundInExtra : predefinedChild
      }
      return predefinedChild
    })
    setCombinedChildren(mappedChildren)
  }, [answers, children, childrenExtraData, externalData])

  return combinedChildren.map((child, index) => {
    return (
      <SelectedRepeaterItem
        index={index}
        readOnlyFields={readOnlyFields}
        repeaterField={child}
        {...props}
      />
    )
  })
}
