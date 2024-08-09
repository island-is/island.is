import { unknownRelationship } from '../messages'
import { ApproveOptions } from '../types'

export const getUnknownRelationshipOptions = () => {
  const options = [
    {
      value: ApproveOptions.No,
      label: unknownRelationship.form.radioButtonNo,
    },
    {
      value: ApproveOptions.Yes,
      label: unknownRelationship.form.radioButtonYes,
    },
  ]

  return options
}
