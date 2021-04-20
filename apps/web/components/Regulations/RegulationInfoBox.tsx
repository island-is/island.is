import React, { FC } from 'react'
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

export const RegulationInfoBox: FC<RegulationInfoBoxProps> = (props) => {
  const { regulation, texts } = props
  const { ministry, lawChapters } = regulation

  const { linkToRegulationSearch } = useRegulationLinkResolver()
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()

  return (
    <RegulationsSidebarBox title={txt('infoboxTitle')}>
      {ministry && (
        <Text>
          <strong>{txt('infoboxMinistry')}:</strong>
          <ul>
            <li>
              <RegulationsSidebarLink
                href={linkToRegulationSearch({ rn: ministry.slug })}
              >
                {ministry.name}
              </RegulationsSidebarLink>
            </li>
          </ul>
        </Text>
      )}

      {lawChapters.length > 0 && (
        <Text>
          <strong>{txt('infoboxLawChapters')}:</strong>
          <ul>
            {lawChapters.map((chapter, i) => (
              <li key={i}>
                <RegulationsSidebarLink
                  href={linkToRegulationSearch({ ch: chapter.slug })}
                >
                  {chapter.name}
                </RegulationsSidebarLink>
              </li>
            ))}
          </ul>
        </Text>
      )}

      {regulation.effectiveDate && (
        <Text>
          <strong>{txt('infoboxEffectiveDate')}:</strong>
          <br />
          {formatDate(regulation.effectiveDate)}
        </Text>
      )}

      {regulation.repealedDate ? (
        <Text>
          <strong>{txt('infoboxRepealed')}:</strong>
          <br />
          {formatDate(regulation.repealedDate)}
        </Text>
      ) : (
        regulation.lastAmendDate && (
          <Text>
            <strong>{txt('infoboxLastAmended')}:</strong>
            <br />
            {formatDate(regulation.lastAmendDate)}
          </Text>
        )
      )}

      <Button
        // icon="print"
        // iconType="outline"
        size="small"
        type="button"
        variant="text"
        onClick={() => {
          window.print()
        }}
      >
        Prenta þessa útgáfu
      </Button>
    </RegulationsSidebarBox>
  )
}
