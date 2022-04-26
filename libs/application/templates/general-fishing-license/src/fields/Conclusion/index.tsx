import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  ArrowLink,
  Box,
  Bullet,
  BulletList,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { WorkplaceIllustration } from '../../assets'
import { conclusion } from '../../lib/messages'

export const Conclusion: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <GridColumn paddingBottom={3} span={['12/12', '12/12', '10/12']}>
        <BulletList space={2} type="ul">
          <Bullet>
            {formatText(
              conclusion.information.bulletOne,
              application,
              formatMessage,
            )}
          </Bullet>
          <Bullet>
            {formatText(
              conclusion.information.bulletTwo,
              application,
              formatMessage,
            )}{' '}
            <ArrowLink
              href={formatMessage(
                conclusion.information.electronicDocumentsLink,
              )}
            >
              {formatMessage(conclusion.information.electronicDocumentsText)}
            </ArrowLink>
          </Bullet>
        </BulletList>
      </GridColumn>

      <Box
        marginTop={[5, 5, 20]}
        marginBottom={[5, 8, 10]}
        display="flex"
        justifyContent="center"
      >
        <WorkplaceIllustration />
      </Box>
    </Box>
  )
}
