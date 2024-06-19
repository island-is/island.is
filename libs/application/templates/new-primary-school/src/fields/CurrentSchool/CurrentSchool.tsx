import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { CategoryCard, Link, Icon, Text, Box } from '@island.is/island-ui/core'
import * as styles from './CurrentSchool.css'
import { useLocale } from '@island.is/localization'
import { newPrimarySchoolMessages } from '../../lib/messages'

export const CurrentSchool: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  // TODO: Use data from JÚNÍ
  return (
    <Box marginTop={2}>
      <Text marginBottom={1} variant="h4">
        {formatMessage(
          newPrimarySchoolMessages.childrenNParents.childInfoCurrentSchool,
        )}
      </Text>
      <CategoryCard
        icon={<Icon icon="school" type="outline" color="blue400" />}
        heading={'Skóli'}
        tags={[{ label: '10', disabled: true }]}
        text=""
        href=""
      >
        <Text paddingBottom={2}>heimilisfang</Text>
        <Text paddingBottom={2}>númer</Text>
        <Link
          href="mailto:h@k.is"
          color="blue400"
          underline="small"
          underlineVisibility="always"
          className={styles.link}
        >
          h@k.is
        </Link>
      </CategoryCard>
    </Box>
  )
}
