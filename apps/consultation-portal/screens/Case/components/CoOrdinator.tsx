import { SimpleCardSkeleton } from '../../../components/Card'
import StackedTitleAndDescription from '../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { Text } from '@island.is/island-ui/core'

interface Props {
  contactEmail: string
  contactName: string
}

export const CoOrdinator = ({ contactEmail, contactName }: Props) => {
  return (
    <SimpleCardSkeleton>
      <StackedTitleAndDescription title="Umsjónaraðili">
        {contactName || contactEmail ? (
          <>
            {contactName && <Text>{contactName}</Text>}
            {contactEmail && <Text>{contactEmail}</Text>}
          </>
        ) : (
          <Text>Engin skráður umsjónaraðili.</Text>
        )}
      </StackedTitleAndDescription>
    </SimpleCardSkeleton>
  )
}
