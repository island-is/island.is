import React from 'react'

interface Props {
  exclamationPoint?: boolean
}

export const ExampleComponent = ({ exclamationPoint = false }: Props) => (
  <p>I'm the example component{exclamationPoint && '!'}</p>
)
