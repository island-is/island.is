import React from 'react'
import * as s from './RegulationsSidebarBox.treat'
import { Button, Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationMaybeDiff } from './Regulations.types'
import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'

export type RegulationInfoBoxProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationInfoBox = (props: RegulationInfoBoxProps) => {
  const { regulation, texts } = props
  const { ministry, lawChapters } = regulation

  const { linkToRegulationSearch } = useRegulationLinkResolver()
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()

  return (
    <RegulationsSidebarBox title={txt('infoboxTitle')} colorScheme="dark">
      {ministry && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxMinistry')}:</strong>
          <ul>
            <li>
              <RegulationsSidebarLink
                href={linkToRegulationSearch({ rn: ministry.slug })}
              >
                <span className={s.smallText}>{ministry.name}</span>
              </RegulationsSidebarLink>
            </li>
          </ul>
        </Text>
      )}

      {lawChapters.length > 0 && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxLawChapters')}:</strong>
          <ul>
            {lawChapters.map((chapter, i) => (
              <li key={i}>
                <RegulationsSidebarLink
                  href={linkToRegulationSearch({ ch: chapter.slug })}
                >
                  <span className={s.smallText}>{chapter.name}</span>
                </RegulationsSidebarLink>
              </li>
            ))}
          </ul>
        </Text>
      )}

      {regulation.effectiveDate && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxEffectiveDate')}:</strong>
          <br />
          <span className={s.smallText}>
            {formatDate(regulation.effectiveDate)}
          </span>
        </Text>
      )}

      {regulation.repealedDate ? (
        <Text marginBottom={3}>
          <strong>{txt('infoboxRepealed')}:</strong>
          <br />
          <span className={s.smallText}>
            {formatDate(regulation.repealedDate)}
          </span>
        </Text>
      ) : (
        regulation.lastAmendDate && (
          <Text marginBottom={3}>
            <strong>{txt('infoboxLastAmended')}:</strong>
            <br />
            <span className={s.smallText}>
              {formatDate(regulation.lastAmendDate)}
            </span>
          </Text>
        )
      )}

      <Text marginBottom={2}>
        <Button
          // FIXME: enable this icon when design is ready and implemented
          // icon="print"
          // iconType="outline"
          size="small"
          type="button"
          variant="text"
          onClick={() => {
            window.print()
          }}
        >
          {txt('printThisVersion')}
        </Button>
      </Text>
    </RegulationsSidebarBox>
  )
}
