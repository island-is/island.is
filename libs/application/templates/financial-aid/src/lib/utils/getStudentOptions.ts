import { approveOptions } from '../messages'
import { ApproveOptions } from '../types'

export const getStudentOptions = () => {
  const options = [
    {
      value: ApproveOptions.No,
      label: approveOptions.no,
    },
    {
      value: ApproveOptions.Yes,
      label: approveOptions.yes,
    },
  ]

  return options
}
