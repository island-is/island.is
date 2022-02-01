import React from 'react'
import {
  ActionCard,
  AlertMessage,
  Box,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { prettyName } from '@island.is/regulations'
import { useHistory } from 'react-router'
import { getImpactUrl } from '../../utils/routing'
import { impactMsgs } from '../../messages'
import { DraftImpactForm } from '../../state/types'

// ---------------------------------------------------------------------------

export type ImpactListProps = {
  impacts: ReadonlyArray<DraftImpactForm>
  title?: string | JSX.Element
  titleEmpty?: string | JSX.Element
}

export const ImpactList = (props: ImpactListProps) => {
  const { impacts, title, titleEmpty } = props

  const history = useHistory()
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage

  return (
    <>
      <Box marginTop={[6, 8, 12]}>
        <Divider />
        {' '}
      </Box>

      {!impacts.length ? (
        <Text variant="h3" as="h3">
          {titleEmpty || t(impactMsgs.impactListTitleEmpty)}
        </Text>
      ) : (
        <Stack space={3}>
          <Text variant="h3" as="h3">
            {title || t(impactMsgs.impactListTitle)}
          </Text>

          {impacts.map((impact, i) => {
            const { id, name, regTitle, error, type, date } = impact
            const isChange = type === 'amend'
            const headingText =
              name === 'self'
                ? t(impactMsgs.selfAffecting)
                : `${prettyName(name)} – ${regTitle}`
            const errorMessage = !error
              ? undefined
              : typeof error === 'string'
              ? error
              : t(error)

            return (
              <ActionCard
                key={i}
                date={formatDateFns(date.value)}
                heading={headingText}
                tag={{
                  label: t(
                    isChange
                      ? impactMsgs.typeChange
                      : impactMsgs.typeCancellation,
                  ),
                  variant: isChange ? 'blueberry' : 'red',
                }}
                cta={{
                  icon: undefined,
                  label: formatMessage(impactMsgs.impactListEditButton),
                  variant: 'ghost',
                  onClick: () => {
                    history.push(getImpactUrl(id))
                  },
                }}
                text={
                  errorMessage &&
                  (((
                    <AlertMessage type="error" title={errorMessage} />
                  ) as unknown) as string)
                }
                // backgroundColor={error ? 'red' : undefined}
              />
            )
          })}
        </Stack>
      )}
    </>
  )
}
