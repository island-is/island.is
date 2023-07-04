export type AttachmentPath = {
  path: string
  prefix: string
}

export const AttachmentPaths: AttachmentPath[] = [
  {
    path: 'estateAttachments.attached.file',
    prefix: 'danarbu_vidhengi',
  },
]

export type ApplicationAttachments = {
  [key: string]: string
}

export type ApplicationFile = {
  key: string
  name: string
}
