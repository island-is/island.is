// UNKNOWN will be added to the API enum by the DOE team — handle it now
export const employeeCountCategoryDisplay: Record<string, string> = {
  UNKNOWN: 'Óþekkt',
  SMALL: '1 - 24',
  MEDIUM: '25 - 49',
  LARGE: '50+',
}

export const getEmployeeCountDisplay = (category?: string): string =>
  (category && employeeCountCategoryDisplay[category]) ??
  employeeCountCategoryDisplay.UNKNOWN
