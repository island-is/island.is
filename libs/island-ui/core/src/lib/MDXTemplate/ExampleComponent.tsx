import React from 'react'

interface Props {
  /** This a comment from the component's interface */
  exclamationPoint?: boolean
}

export const ExampleComponent = ({ exclamationPoint = false }: Props) => (
  <p>I'm the example component{exclamationPoint && '!'}</p>
)
