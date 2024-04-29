import React, { useState } from 'react'

import { Button, Hidden, LinkV2, Text } from '@island.is/island-ui/core'
import { RegulationMaybeDiff } from '@island.is/regulations'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'
import * as s from './RegulationInfoBox.css'
import * as RSBStyles from './RegulationsSidebarBox.css'

export type RegulationInfoBoxProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationInfoBox = (props: RegulationInfoBoxProps) => {
  const { regulation, texts } = props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ministry, lawChapters } = regulation

  const { linkToRegulationSearch } = useRegulationLinkResolver()

  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()

  const [showCopyCheckmark, setShowCopyCheckmark] = useState<
    NodeJS.Timeout | false
  >(false)

  const showCopyCheck = () => {
    setShowCopyCheckmark((showCopyCheckmark) => {
      if (showCopyCheckmark) {
        clearTimeout(showCopyCheckmark)
        setShowCopyCheckmark(false)
        return setTimeout(showCopyCheck, 100)
      }

      return setTimeout(() => {
        setShowCopyCheckmark(false)
      }, 2000)
    })
  }

  const nonCurrent: true | undefined =
    !!regulation.timelineDate || !!regulation.showingDiff || undefined

  return (
    <RegulationsSidebarBox
      title={txt('infoboxTitle')}
      colorScheme="dark"
      className={s.container}
    >
      {ministry && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxMinistry')}:</strong>
          <br />
          <RegulationsSidebarLink
            href={linkToRegulationSearch({ rn: ministry.slug })}
          >
            <span className={RSBStyles.smallText}>{ministry.name}</span>
          </RegulationsSidebarLink>
        </Text>
      )}

      {/*
      {lawChapters.length > 0 && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxLawChapters')}:</strong>
          <ul>
            {lawChapters.map((chapter, i) => (
              <li key={i}>
                <RegulationsSidebarLink
                  href={linkToRegulationSearch({ ch: chapter.slug })}
                >
                  <span className={RSBStyles.smallText}>{chapter.name}</span>
                </RegulationsSidebarLink>
              </li>
            ))}
          </ul>
        </Text>
      )}
      */}

      {regulation.effectiveDate && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxEffectiveDate')}:</strong>
          <br />
          <span className={RSBStyles.smallText}>
            {formatDate(regulation.effectiveDate)}
          </span>
        </Text>
      )}
      <Text marginBottom={2}>
        <strong>{txt('infoboxPublishedDate')}:</strong>
        <br />
        <span className={RSBStyles.smallText}>
          {formatDate(regulation.publishedDate)}
        </span>
      </Text>

      {regulation.repealedDate ? (
        <Text marginBottom={3}>
          <strong>{txt('infoboxRepealed')}:</strong>
          <br />
          <span className={RSBStyles.smallText}>
            {formatDate(regulation.repealedDate)}
          </span>
        </Text>
      ) : regulation.repealed ? (
        <Text marginBottom={3}>
          <strong>{txt('infoboxOgildWat')}</strong>
        </Text>
      ) : (
        regulation.lastAmendDate && (
          <Text marginBottom={3}>
            <strong>{txt('infoboxLastAmended')}:</strong>
            <br />
            <span className={RSBStyles.smallText}>
              {formatDate(regulation.lastAmendDate)}
            </span>
          </Text>
        )
      )}

      <Hidden print={true}>
        <Text marginBottom={1}>
          <Button
            icon="document"
            iconType="outline"
            size="small"
            variant="text"
          >
            <a
              rel={nonCurrent && 'nofollow'}
              href={regulation.pdfVersion}
              style={{ textDecoration: 'none' }}
            >
              {txt('downloadPdf')}
            </a>
          </Button>
        </Text>

        <Text marginBottom={2}>
          <Button
            icon="arrowBack"
            iconType="outline"
            size="small"
            type="button"
            variant="text"
            as="button"
            onClick={() => {
              showCopyCheck()
              navigator.clipboard.writeText(document.location.href)
            }}
          >
            {txt('copyPermaLink')}
          </Button>{' '}
          {showCopyCheckmark && (
            <span className={s.copiedIndicator} aria-hidden="true">
              ✔
            </span>
          )}
        </Text>

        {regulation.originalDoc && (
          <Text marginBottom={1}>
            <Button
              icon="document"
              iconType="outline"
              size="small"
              type="button"
              variant="text"
            >
              <LinkV2 href={regulation.originalDoc}>
                {txt('originalDocLink')}
              </LinkV2>
            </Button>
          </Text>
        )}
      </Hidden>
    </RegulationsSidebarBox>
  )
}
