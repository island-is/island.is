import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Bullet,
  BulletList,
  Stack,
  Text,
  Divider,
} from '@island.is/island-ui/core'
import {
  Application,
  getValueViaPath,
  ValidAnswers,
} from '@island.is/application/core'

const ReviewScreen: FC<FieldBaseProps> = ({ field, application }) => {
  return (
    <Stack space={7}>
      <Stack space={3}>
        <Text variant="h2">Upplysingar</Text>
        <Box>
          <Text variant="h5">Nafn á ráðuneyti eða stofnun sem sækir um</Text>
          <Text>
            {
              getValueViaPath(
                application.answers,
                'applicant.institution',
              ) as string
            }
          </Text>
        </Box>
        <Divider />

        <Text variant="h4">Tengilidur</Text>
        <Box>
          <Text variant="h5">Nafn</Text>
          <Text>
            {getValueViaPath(application.answers, 'contact.name') as string}
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text variant="h5">Netfang</Text>
          <Text>
            {getValueViaPath(application.answers, 'contact.email') as string}
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text variant="h5">Simanumer</Text>
          <Text>
            {
              getValueViaPath(
                application.answers,
                'contact.phoneNumber',
              ) as string
            }
          </Text>
        </Box>
        <Divider />
      </Stack>
      <Stack space={3}>
        <Text variant="h2">Verkefnid</Text>
        <Box>
          <Text variant="h5">Heiti verkefnis</Text>
          <Text>
            {getValueViaPath(application.answers, 'project.name') as string}
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text variant="h5">Bakgrunnur verkefnis</Text>
          <Text>
            {
              getValueViaPath(
                application.answers,
                'project.background',
              ) as string
            }
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text variant="h5">Markmið verkefnis, ávinningur og markhópur</Text>
          <Text>
            {getValueViaPath(application.answers, 'project.goals') as string}
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text variant="h5">Afmörkun verkenfis</Text>
          <Text>
            {getValueViaPath(application.answers, 'project.scope') as string}
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text variant="h5">Fjármögnun</Text>
          <Text>
            {getValueViaPath(application.answers, 'project.finance') as string}
          </Text>
        </Box>
      </Stack>
    </Stack>
  )
}
export default ReviewScreen
