import React from 'react'
import styled from 'styled-components/native'

const Host = styled.View``

interface AccordionProps {
  children: React.ReactNode
}

export function Accordion({ children }: AccordionProps) {
  return <Host>{children}</Host>
}
