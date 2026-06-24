import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import type { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import ReviewSection from './ApplicationSection'
import { AdvancedLicense, groupAdvancedLicenses } from '../../lib/constants'
import { m } from '../../lib/messages'

const messages = m as unknown as Record<string, MessageDescriptor>

export const ApplicationSummary: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()

  const advancedLicense =
    getValueViaPath<Array<keyof typeof AdvancedLicense>>(
      application.answers,
      'advancedLicense',
    ) ?? []
  const applicationFor = groupAdvancedLicenses(advancedLicense)

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
