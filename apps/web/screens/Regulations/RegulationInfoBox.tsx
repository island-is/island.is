import React, { FC } from 'react'
import { Button, FocusableBox, Link, Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationMaybeDiff } from './Regulations.types'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'

export type RegulationInfoBoxProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationInfoBox: FC<RegulationInfoBoxProps> = (props) => {
  const { regulation, texts } = props
  const { linkResolver } = useRegulationLinkResolver()
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()

  return (
    <RegulationsSidebarBox title={txt('infoboxTitle')} colorScheme="blueberry">
      {regulation.ministry && (
        <Text>
          <strong>{txt('infoboxMinistry')}:</strong>
          <ul>
            <li>
              <Link
                href={`${linkResolver('regulationshome').href}?rn=${
                  regulation.ministry.slug
                }`}
              >
                <FocusableBox flexDirection={'column'} component="span">
                  {({
                    isFocused,
                    isHovered,
                  }: {
                    isFocused: boolean
                    isHovered: boolean
                  }) => (
                    <Text
                      color={
                        isFocused || isHovered ? 'blueberry400' : 'blueberry600'
                      }
                    >
                      {regulation.ministry?.name}
                    </Text>
                  )}
                </FocusableBox>
              </Link>
            </li>
          </ul>
        </Text>
      )}

      {regulation.lawChapters.length > 0 && (
        <Text>
          <strong>{txt('infoboxLawChapters')}:</strong>
          <ul>
            {regulation.lawChapters.map((chapter, i) => (
              <li key={i}>
                <Link
                  href={`${linkResolver('regulationshome').href}?ch=${
                    chapter.slug
                  }`}
                >
                  <FocusableBox flexDirection={'column'} component="span">
                    {({
                      isFocused,
                      isHovered,
                    }: {
                      isFocused: boolean
                      isHovered: boolean
                    }) => (
                      <Text
                        color={
                          isFocused || isHovered
                            ? 'blueberry400'
                            : 'blueberry600'
                        }
                      >
                        {chapter.name}
                      </Text>
                    )}
                  </FocusableBox>
                </Link>
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
