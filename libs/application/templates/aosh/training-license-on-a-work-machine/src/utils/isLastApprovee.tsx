export const isLastApprovee = (approved: string[], assignees: string[]) => {
  return approved.length === assignees.length
}
