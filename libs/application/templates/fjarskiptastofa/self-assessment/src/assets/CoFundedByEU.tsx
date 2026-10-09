import React from 'react'

// The 12 stars of the European emblem, evenly spaced on a circle centred on the
// flag. Positions are pre-computed (radius 14 around 36,24) so the component
// stays a plain, dependency-free SVG.
const STAR_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [36, 10],
  [43, 11.876],
  [48.124, 17],
  [50, 24],
  [48.124, 31],
  [43, 36.124],
  [36, 38],
  [29, 36.124],
  [23.876, 31],
  [22, 24],
  [23.876, 17],
  [29, 11.876],
]

// A single five-pointed star centred on the origin (outer radius 3.2).
const STAR_PATH =
  'M0,-3.2 0.752,-1.035 3.044,-0.989 1.217,0.396 1.881,2.589 0,1.28 ' +
  '-1.881,2.589 -1.217,0.396 -3.044,-0.989 -0.752,-1.035 Z'

const EU_BLUE = '#003399'
const EU_YELLOW = '#ffcc00'
const TEXT_BLUE = '#00205c'

/**
 * "Co-funded by the European Union" emblem, shown on the self-assessment intro
 * because the digital submission is co-financed by the EU. Rendered inline so it
 * needs no Contentful asset or external URL.
 */
export const CoFundedByEU = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={260}
    height={54}
    viewBox="0 0 260 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Co-funded by the European Union"
    {...props}
  >
    <rect x={0} y={3} width={72} height={48} fill={EU_BLUE} />
    {STAR_POSITIONS.map(([x, y], index) => (
      <path
        key={index}
        d={STAR_PATH}
        fill={EU_YELLOW}
        transform={`translate(${x} ${y})`}
      />
    ))}
    <text
      x={84}
      y={24}
      fill={TEXT_BLUE}
      fontSize={16}
      fontWeight={700}
      fontFamily="'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    >
      Co-funded by
    </text>
    <text
      x={84}
      y={43}
      fill={TEXT_BLUE}
      fontSize={16}
      fontWeight={700}
      fontFamily="'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    >
      the European Union
    </text>
  </svg>
)

export default CoFundedByEU
