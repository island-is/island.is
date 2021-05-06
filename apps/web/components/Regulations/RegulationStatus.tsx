import * as s from './RegulationStatus.treat'

import React, { ReactNode } from 'react'
import { ISODate, RegulationMaybeDiff } from './Regulations.types'
import { Hidden, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import { useDateUtils } from './regulationUtils'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

// ---------------------------------------------------------------------------

type BallProps = {
  type?: 'green' | 'red'
  children?: ReactNode
}
const Ball = ({ type, children }: BallProps) => (
  <span className={cn(s.ball, type === 'red' && s.ballRed)}>{children}</span>
)

// ---------------------------------------------------------------------------

export type RegulationStatusProps = {
  regulation: Pick<
    RegulationMaybeDiff,
    'repealedDate' | 'timelineDate' | 'lastAmendDate' | 'effectiveDate'
  >
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const RegulationStatus = (props: RegulationStatusProps) => {
  const { regulation, urlDate, texts } = props
  const { formatDate } = useDateUtils()
  const txt = useNamespace(texts)

  const viewingOriginal = regulation.timelineDate === regulation.effectiveDate
  const today = new Date().toISOString().substr(0, 10) as ISODate

  return (
    <>
      <div className={s.printText}>
        <Text>Prentað {formatDate(today)}</Text>
      </div>
      <Hidden print={true}>
        {!regulation.repealedDate ? (
          <Text>
            {!regulation.timelineDate ||
            regulation.timelineDate === regulation.lastAmendDate ? (
              <>
                <Ball type="green" />
                Núgildandi reglugerð
                {regulation.lastAmendDate ? (
                  <>
                    {' – '}
                    <span className={s.metaDate}>
                      uppfærð {formatDate(regulation.lastAmendDate)}
                    </span>
                  </>
                ) : (
                  ''
                )}
              </>
            ) : viewingOriginal ? (
              <>
                <Ball type="red" />
                Upprunaleg útgáfa reglugerðar
                {' – '}
                <span className={s.metaDate}>
                  sem gók gildi þann {formatDate(regulation.timelineDate)}
                </span>
              </>
            ) : regulation.timelineDate > today ? (
              <>
                <Ball type="red" />
                Væntanleg útgáfa reglugerðar
                {' – '}
                <span className={s.metaDate}>
                  sem mun taka gildi þann {formatDate(regulation.timelineDate)}
                </span>
              </>
            ) : (
              <>
                <Ball type="red" />
                Úrelt útgáfa reglugerðar
                {' – '}
                {urlDate ? (
                  <span className={s.metaDate}>
                    eins og leit út þann {formatDate(urlDate)}
                  </span>
                ) : (
                  <span className={s.metaDate}>
                    sem tók gildi þann {formatDate(regulation.timelineDate)}
                  </span>
                )}
              </>
            )}
          </Text>
        ) : (
          <Text>
            <Ball type="red" />
            Úrelt reglugerð{' – '}
            <span className={s.metaDate}>
              felld úr gildi {formatDate(regulation.repealedDate)}
            </span>
          </Text>
        )}
      </Hidden>
    </>
  )
}
