import { CaseTransition } from '@island.is/judicial-system/types'

export const parseArray = (property: string, array: string[]) => {
  try {
    const json = JSON.parse(`{"${property}": [${array.map((a) => `"${a}"`)}]}`)
    return json
  } catch (e) {
    return null
  }
}

export const parseString = (
  property: string,
  value: string | Date | boolean,
) => {
  try {
    const json = JSON.parse(`{"${property}": ${JSON.stringify(value)}}`)
    return json
  } catch (e) {
    console.log(e)
    return null
  }
}

export const parseTransition = (
  modified: string,
  transition: CaseTransition,
) => {
  try {
    const json = JSON.parse(
      `{"modified": "${modified}", "transition": "${transition}"}`,
    )
    return json
  } catch (e) {
    console.log(e)
    return null
  }
}
