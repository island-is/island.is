import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DetailsRepeaterItem } from './DetailsRepeaterItem'
import { formerEducation } from '../../lib/messages/formerEducation'

export const EducationDetails: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const [addMore, setAddMore] = useState<number>(0)
  return (
    <Box paddingTop={2}>
      <Button
        icon="add"
        onClick={() => setAddMore(addMore + 1)}
        variant="ghost"
        fluid
      >
        {formatMessage(
          formerEducation.labels.educationDetails.addMoreButtonTitle,
        )}
      </Button>
      {[...Array(addMore)].map(() => {
        return (
          <Box paddingTop={3}>
            <DetailsRepeaterItem
              application={application}
              goToScreen={goToScreen}
              field={field}
              index={addMore + 1}
            />
            <Button icon="add" onClick={() => setAddMore(addMore + 1)}>
              {formatMessage(
                formerEducation.labels.educationDetails.addMoreButtonTitle,
              )}
            </Button>
          </Box>
        )
      })}
    </Box>
  )
}
