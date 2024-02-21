export type FormHeaderAction =
  | { type: 'changeOrganization'; payload: { value: string } }
  | { type: 'changeApplicationName'; payload: { value: string } }

export function headerInfoReducer(
  info: {
    organization: string
    applicationName: string
  },
  action: FormHeaderAction,
) {
  switch (action.type) {
    case 'changeOrganization': {
      return {
        ...info,
        organization: action.payload?.value ? action.payload.value : '',
      }
    }
    case 'changeApplicationName': {
      return {
        ...info,
        applicationName: action.payload?.value ? action.payload.value : '',
      }
    }
    default: {
      return info
    }
  }
}
