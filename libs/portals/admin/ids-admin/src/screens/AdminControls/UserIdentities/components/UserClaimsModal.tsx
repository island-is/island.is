import {
  Box,
  Button,
  Icon,
  Stack,
  Table as T,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import type { UserIdentityRow } from '../UserIdentities.types'
import * as styles from '../UserIdentities.css'

interface UserClaimsModalProps {
  target: UserIdentityRow
  onClose: () => void
}

export const UserClaimsModal = ({ target, onClose }: UserClaimsModalProps) => {
  const { formatMessage } = useLocale()

  const handleCopySubjectId = (subjectId: string) => {
    navigator.clipboard.writeText(subjectId).then(() => {
      toast.success(formatMessage(m.copySuccess))
    })
  }

  return (
    <Modal
      id={`claims-${target.subjectId}`}
      isVisible
      label={formatMessage(m.userIdentitiesClaimsTitle, {
        subjectId: target.subjectId,
      })}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.cancel)}
      scrollType="outside"
    >
      <Box paddingX={[0, 4]} paddingBottom={4}>
        <Text variant="h2" as="h2" marginBottom={3}>
          {formatMessage(m.userIdentitiesClaimsTitle, {
            subjectId: target.subjectId,
          })}
        </Text>

        {target.claims.length === 0 ? (
          <Text marginBottom={3}>
            {formatMessage(m.userIdentitiesClaimsEmpty)}
          </Text>
        ) : (
          <Stack space={2}>
            <Box className={styles.claimsTable}>
              <T.Table>
                <colgroup>
                  <col className={styles.claimsTypeCol} />
                  <col className={styles.claimsValueCol} />
                </colgroup>
                <T.Head>
                  <T.Row>
                    <T.HeadData>
                      {formatMessage(m.userIdentitiesClaimsType)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(m.userIdentitiesClaimsValue)}
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {target.claims.map((claim, index) => (
                    <T.Row key={`${claim.type}-${index}`}>
                      <T.Data>{claim.type}</T.Data>
                      <T.Data>
                        {claim.type === 'actorSubjectId' ? (
                          <Box
                            display="flex"
                            alignItems="center"
                            columnGap={1}
                            minWidth={0}
                          >
                            <Box minWidth={0} flexGrow={1} title={claim.value}>
                              <Text variant="small" truncate>
                                {claim.value}
                              </Text>
                            </Box>
                            <button
                              type="button"
                              aria-label={formatMessage(m.copy)}
                              onClick={() => handleCopySubjectId(claim.value)}
                            >
                              <Icon
                                type="outline"
                                color="blue400"
                                icon="copy"
                                size="small"
                              />
                            </button>
                          </Box>
                        ) : (
                          claim.value
                        )}
                      </T.Data>
                    </T.Row>
                  ))}
                </T.Body>
              </T.Table>
            </Box>
          </Stack>
        )}

        <Box display="flex" justifyContent="flexEnd" paddingTop={3}>
          <Button onClick={onClose}>{formatMessage(m.cancel)}</Button>
        </Box>
      </Box>
    </Modal>
  )
}
