import { z } from 'zod'
import { ParticipantSchema } from '../lib/dataSchema'

export type Participant = z.TypeOf<typeof ParticipantSchema>
