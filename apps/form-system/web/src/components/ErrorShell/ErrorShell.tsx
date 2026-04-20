import { FC } from 'react'

import {
  Box,
  Bullet,
  BulletList,
  Button,
  Text,
  Column,
  Columns,
  Hidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreErrorScreenMessages } from '@island.is/application/core'
import {
  ApplicationConfigurations,
  ApplicationTypes,
  StaticText,
} from '@island.is/application/types'

import * as styles from './FormShell.css'
import Markdown from 'markdown-to-jsx'
import { NotebookIllustration } from './NotebookIllustration'

const messageTypes = {
  notFound: {
    title: coreErrorScreenMessages.notFoundTitle,
    subTitle: coreErrorScreenMessages.notFoundSubTitle,
    description: coreErrorScreenMessages.notFoundDescription,
  },
  forbidden: {
    title: coreErrorScreenMessages.forbiddenTitle,
    subTitle: coreErrorScreenMessages.forbiddenSubTitle,
    description: coreErrorScreenMessages.forbiddenDescription,
  },
  lost: {
    title: coreErrorScreenMessages.lostTitle,
    subTitle: coreErrorScreenMessages.lostSubTitle,
    description: coreErrorScreenMessages.lostDescription,
  },
  notExist: {
    title: coreErrorScreenMessages.notExistTitle,
    subTitle: coreErrorScreenMessages.notExistSubTitle,
    description: coreErrorScreenMessages.notExistDescription,
  },
  idNotFound: {
    title: coreErrorScreenMessages.applicationIdNotOwnedByUserTitle,
    subTitle: coreErrorScreenMessages.applicationIdNotOwnedByUserSubTitle,
    description: coreErrorScreenMessages.applicationIdNotOwnedByUserDescription,
  },
  badSubject: {
    title: coreErrorScreenMessages.badSubjectTitle,
    subTitle: coreErrorScreenMessages.badSubjectSubTitle,
    description: coreErrorScreenMessages.badSubjectDescription,
  },
  pruned: {
    title: coreErrorScreenMessages.prunedTitle,
    subTitle: coreErrorScreenMessages.prunedSubTitle,
    description: coreErrorScreenMessages.prunedDescription,
  },
}

interface Props {
  title?: StaticText
  subTitle?: StaticText
  description?: StaticText
  errorType?:
    | 'notFound'
    | 'forbidden'
    | 'lost'
    | 'notExist'
    | 'idNotFound'
    | 'badSubject'
    | 'pruned'
  applicationType?: ApplicationTypes
}

export const ErrorShell: FC<React.PropsWithChildren<Props>> = ({
  errorType,
  applicationType,
  title,
  subTitle,
  description,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box className={styles.root}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingBottom={20}
        paddingTop={[5, 5, 0]}
        paddingX={[3, 3, 0]}
        marginX="auto"
      >
        <Columns collapseBelow="lg">
          <Column width="2/3">
            <Box>
              <Text variant="eyebrow" color="red600" marginBottom={3}>
                {formatMessage(coreErrorScreenMessages.application)}
              </Text>
              <Text variant="h1" as="h1" marginBottom={3}>
                {formatMessage(
                  title ?? messageTypes[errorType ?? 'notFound'].title,
                )}
              </Text>

              <Text as="p" marginBottom={3}>
                {formatMessage(
                  subTitle ?? messageTypes[errorType ?? 'notFound'].subTitle,
                )}
              </Text>
              <Box marginBottom={8}>
                <BulletList>
                  <Markdown
                    options={{
                      forceBlock: true,
                      overrides: {
                        li: {
                          component: Bullet,
                        },
                      },
                    }}
                  >
                    {formatMessage(
                      description ??
                        messageTypes[errorType ?? 'notFound'].description,
                    )}
                  </Markdown>
                </BulletList>
              </Box>

              <Box display="flex" columnGap="p4">
                {applicationType && (
                  <a
                    tabIndex={-1}
                    className={styles.link}
                    href={`/umsoknir/${ApplicationConfigurations[applicationType].slug}`}
                  >
                    <Button>
                      {formatMessage(
                        coreErrorScreenMessages.buttonNewApplication,
                      )}
                    </Button>
                  </a>
                )}
                <a
                  tabIndex={-1}
                  className={styles.link}
                  href={`/minarsidur/umsoknir`}
                >
                  <Button>
                    {formatMessage(
                      coreErrorScreenMessages.buttonMyApplications,
                    )}
                  </Button>
                </a>
              </Box>
            </Box>
          </Column>
          <Column width="1/3">
            <Hidden below="lg">
              <NotebookIllustration />
            </Hidden>
          </Column>
        </Columns>
      </Box>
    </Box>
  )
}
