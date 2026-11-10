export const focusAfterClose = (element: HTMLElement | null | undefined) => {
  window.setTimeout(() => element?.focus(), 0)
}
