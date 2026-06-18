export const parseQueryParamValue = (
  value?: string,
):
  | { courseId?: string; courseInstanceId?: string; courseListPageId?: string }
  | undefined => {
  if (!value) return undefined
  try {
    const parsedValue = JSON.parse(value)
    return parsedValue
  } catch {
    return undefined
  }
}
