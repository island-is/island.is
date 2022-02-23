export interface HandledResponse {
  error?: unknown
  success: boolean
}

// service returns response in the form of { value: number } but openapi doc says
// that it only returns a number - and it returns a string on error
export const handleCreateResponse = (response: unknown): HandledResponse => {
  if (response === '') {
    return { success: true }
  }

  try {
    const resObj = JSON.parse(response as string)

    if (resObj?.value) {
      return { success: true }
    } else if (typeof resObj === 'number') {
      // if it's a number it means the API now returns the same type as is documented
      return { success: true }
    } else if (typeof resObj === 'string') {
      return { success: false, error: resObj }
    } else {
      return { success: false, error: 'unknown type of response' }
    }
  } catch (e) {
    return { success: false, error: e }
  }
}
