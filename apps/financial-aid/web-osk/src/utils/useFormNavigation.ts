import { useEffect, useState, useContext } from 'react'
import useNavigationTree, {
  FormStepperSection,
} from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

interface NavigationInfoProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl?: string
  nextUrl?: string
}

export const findSectionIndex = (
  navigationTree: FormStepperSection[],
  currentRoute: string,
) => {
  for (const [index, item] of Object.entries(navigationTree)) {
    if (item.url === currentRoute) {
      return { activeSectionIndex: parseInt(index) }
    }

    if (item.children) {
      for (const [childIndex, child] of Object.entries(item.children)) {
        if (child.url === currentRoute) {
          return {
            activeSectionIndex: parseInt(index),
            activeSubSectionIndex: parseInt(childIndex),
          }
        }
      }
    }
  }

  return { activeSectionIndex: 0 }
}

const useFormNavigation = (currentRoute: string): NavigationInfoProps => {
  const { form, updateForm } = useContext(FormContext)

  var navigationTree = useNavigationTree(Boolean(form?.hasIncome))

  const getNextUrl = (obj: FormStepperSection) => {
    if (obj?.children) {
      return obj?.children[0]?.url
    } else {
      return obj?.url
    }
  }

  const findNextUrl = (obj: NavigationInfoProps) => {
    let currBranch = navigationTree[obj?.activeSectionIndex]

    if (
      obj.activeSubSectionIndex != undefined &&
      currBranch.children &&
      currBranch.children[obj.activeSubSectionIndex + 1]
    ) {
      return getNextUrl(currBranch.children[obj.activeSubSectionIndex + 1])
    }

    return getNextUrl(navigationTree[obj.activeSectionIndex + 1])
  }

  const getPrevUrl = (obj: FormStepperSection) => {
    if (obj?.children) {
      return obj?.children[obj?.children.length - 1]?.url
    }

    return obj?.url
  }

  const findPrevUrl = (obj: NavigationInfoProps) => {
    let currBranch = navigationTree[obj?.activeSectionIndex]

    if (
      obj.activeSubSectionIndex != undefined &&
      currBranch.children &&
      currBranch.children[obj.activeSubSectionIndex - 1]
    ) {
      return getPrevUrl(currBranch.children[obj.activeSubSectionIndex - 1])
    }

    return getPrevUrl(navigationTree[obj.activeSectionIndex - 1])
  }

  const createNavigationInfo = (navigationTree: FormStepperSection[]) => {
    const findSection = findSectionIndex(navigationTree, currentRoute)

    const nextUrl = findNextUrl(findSection)
    const prevUrl = findPrevUrl(findSection)

    return {
      activeSectionIndex: findSection.activeSectionIndex,
      activeSubSectionIndex: findSection?.activeSubSectionIndex,
      prevUrl: prevUrl,
      nextUrl: nextUrl,
    }
  }

  const [navigationInfo, setNavigationInfo] = useState<NavigationInfoProps>(
    createNavigationInfo(navigationTree),
  )

  useEffect(() => {
    setNavigationInfo(createNavigationInfo(navigationTree))
  }, [form?.hasIncome])

  return navigationInfo
}

export default useFormNavigation
