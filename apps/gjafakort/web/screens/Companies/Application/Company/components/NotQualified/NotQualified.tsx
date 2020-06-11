import React from 'react'
import Link from 'next/link'

import {
  Box,
  Button,
  Typography,
  BulletList,
  Bullet,
  Stack,
} from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import { FormLayout } from '@island.is/gjafakort-web/components'

function NotQualified() {
  const {
    t: {
      company: { notQualified: t },
      routes,
    },
  } = useI18n()

  return (
    <FormLayout>
      <Box marginBottom={2}>
        <Typography variant="h1" as="h1">
          {t.title}
        </Typography>
      </Box>
      <Box marginBottom={6}>
        <Stack space={3}>
          <Typography variant="intro">{t.intro}</Typography>
          <Typography variant="p">{t.description}</Typography>
          <BulletList type="ol">
            {t.conditions.map((condition) => (
              <Bullet>{condition}</Bullet>
            ))}
          </BulletList>
          <Typography variant="p">{t.caption}</Typography>
        </Stack>
      </Box>
      <Link href={routes.companies.application}>
        <span>
          <Button variant="text">{t.button}</Button>
        </span>
      </Link>
    </FormLayout>
  )
}

export default NotQualified
