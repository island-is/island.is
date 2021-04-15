import React, { FC } from 'react'
import { FocusableBox, Link, Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationMaybeDiff } from './Regulations.types'
import { RegulationsSidebarBox } from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import {
  interpolate,
  prettyName,
  useRegulationLinkResolver,
} from './regulationUtils'

export type RegulationEffectsBoxProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationEffectsBox: FC<RegulationEffectsBoxProps> = (props) => {
  const { regulation, texts } = props
  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  if (!regulation.effects.length) {
    return null
  }

  return (
    <RegulationsSidebarBox
      title={interpolate(txt('effectsTitle'), { name: regulation.name })}
      colorScheme="blueberry"
    >
      {regulation.effects.map((item, i) => {
        const name = prettyName(item.name)
        const label = interpolate(
          item.effect === 'amend' ? txt('effectsChange') : txt('effectsCancel'),
          { name },
        )
        const labelLong = label + ' ' + item.title

        return (
          <Link
            key={'effects-' + i}
            href={linkToRegulation(item.name)}
            aria-label={labelLong}
          >
            <FocusableBox
              flexDirection={'column'}
              component="span"
              title={labelLong}
            >
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
                  {label}
                </Text>
              )}
            </FocusableBox>
          </Link>
        )
      })}
    </RegulationsSidebarBox>
  )
}
