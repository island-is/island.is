import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import React, { FC } from 'react'
import { ISODate, Regulation } from './Regulations.types'
import { Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as s from './RegulationStatus.treat'

// ---------------------------------------------------------------------------

type BallProps = {
  type?: 'green' | 'red'
}
const Ball: React.FC<BallProps> = ({ type, children }) => (
  <span className={cn(s.ball, type === 'red' && s.ballRed)}>{children}</span>
)

// ---------------------------------------------------------------------------

export type RegulationStatusProps = {
  regulation: Regulation
  urlDate?: ISODate
  today: ISODate
  viewingOriginal: boolean
}

export const RegulationStatus: FC<RegulationStatusProps> = (props) => {
  const { regulation, urlDate, viewingOriginal, today } = props

  const dateUtl = useDateUtils()
  const formatDate = (isoDate: string) => {
    return dateUtl.format(new Date(isoDate), 'd. MMM yyyy')
  }

  return (
    <>
      {!regulation.repealedDate ? (
        <Text>
          {!regulation.timelineDate ? (
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
    </>
  )
}
