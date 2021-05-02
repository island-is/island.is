import React, { FC } from 'react'
import get from 'lodash/get'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { Box, Button, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'

const ChildSelector: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const { children, existingApplications } = get(
    application,
    'externalData.children.data',
    [],
  ) as {
    children: { expectedDateOfBirth: string }[]
    existingApplications: {
      applicationId: string
      expectedDateOfBirth: string
    }[]
  }

  return (
    <Box>
      {children.length > 0 && (
        <>
          <FieldDescription
            // description={formatMessage(parentalLeaveFormMessages.selectChild.title)}
            description="Börn sem þú getur sótt um fyrir"
          />
          <Box marginY={3}>
            <RadioController
              id="selectedChild"
              disabled={false}
              name="selectedChild"
              defaultValue={
                getValueViaPath(
                  application.answers,
                  'selectedChild',
                ) as string[]
              }
              options={children.map((child, index) => ({
                value: `${index}`,
                label: child.expectedDateOfBirth,
              }))}
              onSelect={(s: string) => {
                console.log('selected', s)
              }}
            />
          </Box>
        </>
      )}
      {existingApplications.length > 0 && (
        <>
          <FieldDescription
            // description={formatMessage(parentalLeaveFormMessages.selectChild.title)}
            description="Virkar umsóknir"
          />
          <Box marginY={3}>
            {existingApplications.map(
              ({ applicationId, expectedDateOfBirth }) => (
                <Link
                  shallow={false}
                  as={`/umsoknir/faedingarorlof/${applicationId}`}
                  href={`/umsoknir/faedingarorlof/${applicationId}`}
                >
                  <Button
                    variant="text"
                    // size="default"
                    icon="arrowForward"
                  >
                    {expectedDateOfBirth}
                  </Button>
                </Link>
              ),
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default ChildSelector
