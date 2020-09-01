import { useEffect, RefObject } from 'react'

export function useOutsideClick(ref: RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) cb()
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, cb])
}

export default useOutsideClick
