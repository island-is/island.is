import { NationalRegistryIndividual } from '@island.is/application/types'
import { ActionCardProps } from '@island.is/island-ui/core/types'

const formatNationalId = (nationalId: string) =>
  `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`

export const mapIndividualToActionCard = (
  individual: NationalRegistryIndividual,
): ActionCardProps => ({
  heading: individual.fullName,
  avatar: true,
  tag:
    individual.age < 18
      ? { label: 'Barn', outlined: true, variant: 'purple' }
      : undefined,
  text: `Kennitala ${formatNationalId(individual.nationalId)}`,
})
