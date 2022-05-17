import { useState } from 'react'

export const getTitle = (): string => {
  const [title, setTitle] = useState('Mínir ökunemar')
  const element = document.getElementById('students')
  element?.addEventListener('changeTitle', (e) => {
    setTitle((e as CustomEvent).detail)
  })
  return title
}
