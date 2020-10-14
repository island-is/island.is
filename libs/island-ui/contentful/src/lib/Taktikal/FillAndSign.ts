import { OpenDocumentOptions } from '@taktikal/fillandsign/dist/types'

export const openDocument = (
  dropSignFileKey: string,
  options?: OpenDocumentOptions,
) => {
  import('@taktikal/fillandsign').then(({ openDocument }) =>
    Promise.resolve(openDocument(dropSignFileKey, options)),
  )
}

export const fillAndSignKeyframes = `
    @keyframes fillandsign__modalFadeIn {
        from { transform: translate(0, 50px); opacity: 0; }
        to   { transform: translate(0, 0); opacity: 1; }
    }
    @keyframes fillandsign__modalFadeOut {
        from { transform: translate(0, 0); opacity: 1; }
        to   { transform: translate(0, 50px); opacity: 0; }
    }
    @keyframes fillandsign__modalBackgroundFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
`
