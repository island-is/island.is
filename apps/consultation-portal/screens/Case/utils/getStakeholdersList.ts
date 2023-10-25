import { Stakeholder } from '../../../types/interfaces'

interface Props {
  stakeholders: Stakeholder[]
  extraStakeholderList: string
}

const getStakeholdersList = ({ stakeholders, extraStakeholderList }: Props) => {
  const mappedStakeholders = stakeholders?.map((stakeholder) => {
    return { name: stakeholder.name }
  })

  const cleanExtraStakeholderList =
    extraStakeholderList !== '' ? extraStakeholderList : undefined

  const mappedExtraStakeholderList = cleanExtraStakeholderList
    ?.split('\n')
    .map((stakeholder) => {
      return { name: stakeholder }
    })

  return [...(mappedStakeholders || []), ...(mappedExtraStakeholderList || [])]
}

export default getStakeholdersList
