import styled from 'styled-components'
import { Tag, TagProps } from '@island.is/island-ui/core'

interface CardProps {
  type: 'purple' | 'blue' | 'green' | 'red'
}

export const Card = () => {
  //     const myt: TagProps = {
  //         onClick?: () => void
  //   variant?: TagVariant
  //   href?: string
  //   id?: string
  //   active?: boolean
  //   disabled?: boolean
  //   outlined?: boolean
  //   /** Renders a red dot driving attention to the tag. */
  //   attention?: boolean
  //   children: string | ReactNode
  //   truncate?: boolean
  //   hyphenate?: boolean
  //   textLeft?: boolean
  //   CustomLink?: FC
  //     }
  return (
    <Container>
      <Tag>Dummy</Tag>
    </Container>
  )
}

export default Card

const Container = styled.div`
  box-sizing: border-box;

  /* Auto layout */

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 32px;
  gap: 16px;

  width: 358px;
  height: 460px;

  /* Primary/White/400 */

  background: #ffffff;
  /* Secondary/Purple/300 */

  border: 1px solid #c3abd9;
  border-radius: 8px;
`
