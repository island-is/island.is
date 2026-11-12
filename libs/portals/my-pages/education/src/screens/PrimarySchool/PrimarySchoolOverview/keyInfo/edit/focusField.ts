/**
 * island-ui's Select does not forward a ref. It renders its text input with the
 * id `<name>-input` (see Select.tsx), which is what a failed validation focuses.
 */
export const focusSelect = (name: string) => {
  document.getElementById(`${name}-input`)?.focus()
}

export const focusInput = (name: string) => {
  document.getElementsByName(name)[0]?.focus()
}
