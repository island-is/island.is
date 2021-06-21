import { useEffect, useState, useContext } from 'react'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

interface ResultProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl: string | undefined
  nextUrl: string | undefined
}

const useFormNavigation = (currentUrl: string) => {
  const { form, updateForm } = useContext(FormContext)

  const [result, setResult] = useState<ResultProps>()

  var sections = useNavigationTree(form?.hasIncome)

  const getNextUrl = (obj: {
    name?: string
    url?: string
    type?: string
    children?: { type?: string; name?: string; url?: string }[]
  }) => {
    if (obj) {
      if (obj.children) {
        return obj?.children[0]?.url ?? ''
      } else {
        return obj.url
      }
    }

    return '/umsokn'
  }

  const getPrevUrl = (obj: {
    name?: string
    url?: string
    type?: string
    children?: { type?: string; name?: string; url?: string }[]
  }) => {
    if (obj) {
      if (obj.children) {
        return obj?.children[obj?.children.length - 1]?.url ?? ''
      } else {
        return obj.url
      }
    }

    return '/umsokn'
  }

  useEffect(() => {
    sections.map((item, index) => {
      if (item.children) {
        item.children.map((el: any, i: number) => {
          if (el.url === currentUrl) {
            setResult({
              ...result,
              activeSectionIndex: index,
              activeSubSectionIndex: i,
              nextUrl: getNextUrl(
                item.children[i + 1]
                  ? item.children[i + 1]
                  : sections[index + 1],
              ),
              prevUrl: getPrevUrl(
                item.children[i - 1]
                  ? item.children[i - 1]
                  : sections[index - 1],
              ),
            })
          }
        })
      } else {
        if (item.url === currentUrl) {
          setResult({
            ...result,
            activeSectionIndex: index,
            nextUrl: getNextUrl(sections[index + 1]),
            prevUrl: getPrevUrl(sections[index - 1]),
          })
        }
      }
    })
  }, [form?.hasIncome])

  return result
}

export default useFormNavigation
