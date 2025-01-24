// Allowed HTML tags and attributes for SVG.

export const svgTags = [
  'svg',
  'g',
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
  'text',
  'tspan',
  'defs',
  'use',
  'symbol',
  'clipPath',
  'mask',
  'filter',
  'foreignObject',
]

const svgAttributes = [
  'width',
  'height',
  'x',
  'y',
  'viewBox',
  'fill',
  'stroke',
  'stroke-width',
  'opacity',
  'transform',
  'd',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'points',
  'href',
  'xlink:href', // Legacy href for SVGs
]

export const svgAttr = {
  svg: svgAttributes,
  g: svgAttributes,
  path: svgAttributes,
  circle: svgAttributes,
  rect: svgAttributes,
  line: svgAttributes,
  polyline: svgAttributes,
  polygon: svgAttributes,
  ellipse: svgAttributes,
  text: svgAttributes,
  tspan: svgAttributes,
  use: ['xlink:href', 'href'],
}
