import format from 'date-fns/format'
import get from 'lodash/get'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { FieldDescription } from '@island.is/shared/form-fields'

import { parentalLeaveFormMessages } from '../../lib/messages'

const ExistingApplications: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { existingApplications } = get(
    application,
    'externalData.children.data',
    [],
  ) as {
    existingApplications: {
      applicationId: string
      expectedDateOfBirth: string
      adoptionDate: string
    }[]
  }

  const selectExistingApplication = (id: string) => {
    navigate(`/${ApplicationConfigurations.ParentalLeave.slug}/${id}`)
  }

  const formatDateOfBirth = (value: string) =>
    format(new Date(value), dateFormat.is)

  return (
    <Box>
      {existingApplications.length > 0 && (
        <>
          <FieldDescription
            description={formatMessage(
              parentalLeaveFormMessages.selectChild.activeApplications,
            )}
          />

          {existingApplications.map(
            ({ applicationId, expectedDateOfBirth, adoptionDate }) => (
              <Box marginBottom={'gutter'}>
                <ActionCard
                  heading={
                    adoptionDate
                      ? formatMessage(
                          parentalLeaveFormMessages.selectChild
                            .fosterCareOrAdoption,
                          {
                            dateOfBirth: formatDateOfBirth(adoptionDate),
                          },
                        )
                      : formatMessage(
                          parentalLeaveFormMessages.selectChild.baby,
                          {
                            dateOfBirth: formatDateOfBirth(expectedDateOfBirth),
                          },
                        )
                  }
                  text={applicationId}
                  cta={{
                    label: formatMessage(
                      parentalLeaveFormMessages.selectChild.choose,
                    ),
                    onClick: () => {
                      selectExistingApplication(applicationId)
                    },
                  }}
                />
              </Box>
            ),
          )}
        </>
      )}
    </Box>
  )
}

export default ExistingApplications
