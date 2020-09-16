export const parseArray = (property: string, array: string[]) => {
  try {
    const json = JSON.parse(`{"${property}": [${array.map((a) => `"${a}"`)}]}`)
    return json
  } catch (e) {
    return null
  }
}

export const parseString = (property: string, value: string | Date) => {
  try {
    const json = JSON.parse(`{"${property}": "${value}"}`)
    return json
  } catch (e) {
    console.log(e)
    return null
  }
}
