import { useEffect, useState, useContext } from 'react'

import useNavigationTree from '@island.is/financial-aid-web/osk/src/utils/useNavigationTree'
import {
  Form,
  FormContext,
} from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

// navigationInfo
interface ResultProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl?: string
  nextUrl?: string
}

const useFormNavigation = (currentUrl: string) => {
  const { form, updateForm } = useContext(FormContext)

  var sections = useNavigationTree()

  // const createNavigationInfo = (
  //   form: Form | undefined,
  //   navigationTree: any,
  // ): ResultProps => {
  //   return {
  //     activeSectionIndex: 1,
  //     activeSubSectionIndex: 2,
  //     prevUrl: 'lol',
  //     nextUrl: 'lol',
  //   }
  // }

  // better name
  const [result, setResult] = useState<ResultProps>()

  // Use types
  const getNextUrl = (obj: {
    name?: string
    url?: string
    type?: string
    children?: { type?: string; name?: string; url?: string }[]
  }) => {
    if (obj) {
      if (obj.children) {
        return obj?.children[0]?.url
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
        return obj?.children[obj?.children.length - 1]?.url
      } else {
        return obj.url
      }
    }

    return '/umsokn'
  }

  useEffect(() => {
    // nota foreach eða for (const [index, file] of files.entries())
    // finna sectionið í trénu
    // Finna út prev og next í trénu
    // vista state
    // reyna að nota types
    // og nöfn sem meika sense

    // const bla = createNavigationInfo(form, sections)
    // setResult(bla)

    let currentSection = undefined

    sections.find

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
