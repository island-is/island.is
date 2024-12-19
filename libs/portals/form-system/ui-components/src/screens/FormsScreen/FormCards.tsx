import { ApplicationCard } from '@island.is/application/ui-components'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { Stack } from '@island.is/island-ui/core'

interface Props {
  forms?: {
    id: string
    modified: Date
    status: ApplicationStatus
    typeId?: ApplicationTypes | 'exampleType'
    name: string
    progress: number
    actionCard: {
      draftFinishedSteps: number
      draftTotalSteps: number
      description: string
    }
  }[]
}

export const FormCards = ({ forms }: Props) => {
  const handleOnClick = (id: string) => {
    // TODO: Implement
    console.log(`Clicked on form with id: ${id}`)
  }

  const onDelete = () => {
    // TODO: Implement
  }

  if (!forms) return null

  return (
    <Stack space={3}>
      {forms.map((form) => (
        <ApplicationCard
          key={form.id}
          application={{
            id: form.id,
            modified: form.modified,
            status: form.status,
            typeId: ApplicationTypes.EXAMPLE,
            name: form.name,
            progress: form.progress,
            actionCard: {
              draftFinishedSteps: form.actionCard.draftFinishedSteps,
              draftTotalSteps: form.actionCard.draftTotalSteps,
              description: form.actionCard.description,
            },
          }}
          onClick={() => handleOnClick(form.id)}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  )
}
