import { VmstApplicationStatusColor } from './models/overview.model'

const statusColorMap: Record<string, VmstApplicationStatusColor> = {
  '116C6A68-B99F-4CE5-ED45-08D68A7CCD0A': VmstApplicationStatusColor.mint, // Samþykkt
  '48FCEC50-D751-4EB9-ED46-08D68A7CCD0A': VmstApplicationStatusColor.mint, // Samþykkt með biðtíma
  '36776DB2-8E84-46BC-014F-08D684B37226': VmstApplicationStatusColor.purple, // Í vinnslu hjá umsækjanda
  '1D3E3488-AB0E-47CD-77FA-08DE64049C13': VmstApplicationStatusColor.purple, // Sjálfvirk frestun
  'C7CFD3FA-3B6C-40A8-ED47-08D68A7CCD0A': VmstApplicationStatusColor.purple, // Eftirlit og Innheimta - Frestun
  '0625270E-E65B-4F19-C437-08D6DD255789': VmstApplicationStatusColor.purple, // Frestun - vantar gögn
  '3AB2DB10-6FC4-4154-C438-08D6DD255789': VmstApplicationStatusColor.red, // Viðurlög
  '66613514-A8F8-47F9-C439-08D6DD255789': VmstApplicationStatusColor.purple, // Endurumfjöllun
  '724EE394-E86A-4F08-D801-08D661A91A1E': VmstApplicationStatusColor.mint, // Ný umsókn
  '6C52C17C-1FD6-4288-ED4B-08D68A7CCD0A': VmstApplicationStatusColor.red, // Synjun
  '698CD995-06E8-464E-AA2C-08D74E4B72AD': VmstApplicationStatusColor.red, // Afskráð
  'DC21E229-126B-4D22-145A-08D69BC482B7': VmstApplicationStatusColor.red, // Lokað/Ógild
}

export const resolveStatusColor = (
  statusId?: string | null,
): VmstApplicationStatusColor =>
  statusColorMap[statusId?.toUpperCase() ?? ''] ??
  VmstApplicationStatusColor.warn
