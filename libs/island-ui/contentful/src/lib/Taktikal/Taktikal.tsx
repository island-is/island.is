import './Taktikal.treat'

export const OpenDocument = (dropSignFileKey: string) => {
  import('@taktikal/fillandsign').then(({ openDocument }) => {
    Promise.resolve(openDocument(dropSignFileKey))
  })
}
