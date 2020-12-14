export const plausibleEvent = (eventName: string, parameters: object) => {
  const plausible = (<any>window).plausible
  if (plausible) {
    plausible(eventName, { props: parameters })
  }
}
