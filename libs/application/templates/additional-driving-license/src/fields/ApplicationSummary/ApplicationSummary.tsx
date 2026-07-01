import React, { FC, useEffect } from 'react'
import { MessageDescriptor } from 'react-intl'
import type { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import ReviewSection from './ApplicationSection'
import {
  AdvancedLicense,
  B_ADVANCED,
  groupAdvancedLicenses,
} from '../../lib/constants'
import { m } from '../../lib/messages'

const messages = m as unknown as Record<string, MessageDescriptor>

export const ApplicationSummary: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setBeforeSubmitCallback }) => {
  const { formatMessage } = useLocale()

  const advancedLicense =
    getValueViaPath<Array<keyof typeof AdvancedLicense>>(
      application.answers,
      'advancedLicense',
    ) ?? []
  const applicationFor = groupAdvancedLicenses(advancedLicense)

  // This is the final submit screen of the prerequisites form. The selection
  // screen's own setBeforeSubmitCallback only fires when leaving that screen,
  // so a user can navigate back, uncheck everything, and jump forward to here
  // with an empty selection. Re-check at the actual submit to block that.
  const isAdvancedApplication =
    getValueViaPath<string>(application.answers, 'applicationFor') === B_ADVANCED

  useEffect(() => {
    if (!setBeforeSubmitCallback) return

    setBeforeSubmitCallback(async () => {
      if (isAdvancedApplication && advancedLicense.length === 0) {
        return [false, formatMessage(m.applicationForAdvancedRequiredError)]
      }
      return [true, null]
    })
  }, [
    setBeforeSubmitCallback,
    isAdvancedApplication,
    advancedLicense.length,
    formatMessage,
  ])

  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      ></Box>
      <Box marginTop={3} marginBottom={8}>
        {applicationFor.map((group, i) => (
          <Box key={`group-${group.group}`} marginTop={i === 0 ? 0 : 5}>
            <Text variant="default" marginBottom={2}>
              {/* TODO: What should the message be here? Should it be the group title or something else?*/}
              {formatMessage(messages[`groupTitle${group.group}`])}{' '}
            </Text>
            <Box paddingLeft={[0, 0, 2]}>
              {group.codes.map((code, j) => (
                <ReviewSection
                  key={`${group.group}-${code}`}
                  application={application}
                  index={j + 1}
                  step={{
                    title:
                      messages[`applicationForAdvancedLicenseTitle${code}`] ??
                      messages[`applicationForAdvancedLicenseLabel${code}`],
                    description:
                      messages[`applicationForAdvancedLicenseLabel${code}`],
                    group: group.group,
                    subGroup: code,
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
