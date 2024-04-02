import { z } from 'zod'
import { EFormApplicantTypes } from '../types/enums'
import {
  IApplicantType,
  ICertificate,
  IForm,
  IFormApplicantType,
  IFormBuilder,
  IGroup,
  IInput,
  IInputSettings,
  IInputType,
  IListType,
  IStep,
  ITenging,
} from '../types/interfaces'

const languageSchema = z.object({
  is: z.string(),
  en: z.string(),
})

const dependencySchema = z.record(z.array(z.string())) as z.ZodSchema<ITenging>

const inputSettingsSchema = z.object({
  $type: z.string().optional(),
  isLarge: z.boolean().optional(),
  size: z.enum(['xs', 'sm', 'md']),
  interval: z.string().optional(),
  erHlekkur: z.boolean().optional(),
  url: z.string().optional(),
  hnapptexti: languageSchema.optional(),
  tegundir: z.array(z.string()).optional(),
  hamarksstaerd: z.number().optional(),
  erFjolval: z.boolean().optional(),
  fjoldi: z.number().optional(),
  header: z.string().optional(),
  hamarkslengd: z.number().optional(),
  lagmarkslengd: z.number().optional(),
  laggildi: z.number().optional(),
  hagildi: z.number().optional(),
  listi: z
    .array(
      z.object({
        guid: z.string(),
        label: languageSchema,
        description: languageSchema,
        displayOrder: z.number(),
        isSelected: z.boolean(),
      }),
    )
    .optional(),
  type: z.string().optional(),
  name: languageSchema.optional(),
  erListi: z.boolean().optional(),
  erInnslattur: z.boolean().optional(),
}) as z.ZodSchema<IInputSettings>

export const inputSchema = z.object({
  id: z.number(),
  name: languageSchema,
  description: languageSchema,
  isRequired: z.boolean(),
  displayOrder: z.number(),
  groupId: z.number(),
  groupGuid: z.string(),
  isHidden: z.boolean(),
  type: z.string(),
  guid: z.string(),
  inputFields: z.record(z.any()),
  inputSettings: inputSettingsSchema,
  isPartOfMultiSet: z.boolean(),
}) as z.ZodSchema<IInput>

export const groupSchema = z.object({
  id: z.number(),
  name: languageSchema,
  guid: z.string(),
  displayOrder: z.number(),
  isHidden: z.boolean(),
  multiSet: z.number(),
  stepId: z.number(),
  stepGuid: z.string(),
  inputs: z.array(inputSchema),
}) as z.ZodSchema<IGroup>

export const stepSchema = z.object({
  id: z.number(),
  guid: z.string(),
  displayOrder: z.number(),
  name: languageSchema,
  type: z.string(),
  waitingText: languageSchema,
  callRuleset: z.boolean(),
  isHidden: z.boolean(),
  isCompleted: z.boolean(),
  groups: z.array(groupSchema),
}) as z.ZodSchema<IStep>

const certificateSchema = z.object({
  id: z.number(),
  type: z.string(),
  name: languageSchema,
  description: languageSchema,
}) as z.ZodSchema<ICertificate>

const applicantTypesSchema = z.enum([
  EFormApplicantTypes.einstaklingur,
  EFormApplicantTypes.einstaklingurMedUmbodAnnarsEinstaklings,
  EFormApplicantTypes.einstaklingurMedUmbodLogadila,
  EFormApplicantTypes.einstaklingurMedProkuru,
  EFormApplicantTypes.einstaklingurUmbodsveitandi,
  EFormApplicantTypes.logadili,
])

const formApplicantSchema = z.object({
  formId: z.number(),
  applicantTypeId: z.number(),
  name: languageSchema,
  type: applicantTypesSchema,
}) as z.ZodSchema<IFormApplicantType>

export const formSchema = z.object({
  id: z.number(),
  name: languageSchema,
  organization: z.object({
    id: z.number(),
    name: languageSchema,
    kennitala: z.string(),
    scope: z.string(),
    xroadBaseUrl: z.string(),
  }),
  created: z.date(),
  lastChanged: z.date(),
  invalidationDate: z.date().optional(),
  dependencies: dependencySchema,
  stepsList: z.array(stepSchema).default([]),
  groupsList: z.array(groupSchema).default([]),
  inputsList: z.array(inputSchema).default([]),
  stopProgressOnValidatingStep: z.boolean(),
  applicationsDaysToRemove: z.number(),
  isTranslated: z.boolean(),
  documentTypes: z.array(certificateSchema),
  formApplicantTypes: z.array(formApplicantSchema),
}) as z.ZodSchema<IForm>

const inputTypeSchema = z.object({
  type: z.string(),
  name: z.string(),
  description: z.string(),
  organizations: z.array(z.number()).optional(),
  inputFields: z.object({}).optional(),
  inputMetadata: z.object({}).optional(),
  ruleset: z.object({}).optional(),
  inputSettings: inputSettingsSchema,
}) as z.ZodSchema<IInputType>

const applicantTypeSchema = z.object({
  id: z.number(),
  name: languageSchema,
  type: applicantTypesSchema,
  nameSuggestions: z.array(
    z.object({
      applicantTypeId: z.number(),
      nameSuggestion: languageSchema,
    }),
  ),
}) as z.ZodSchema<IApplicantType>

const listTypeSchema = z.object({
  id: z.number(),
  type: z.string(),
  name: languageSchema,
  description: languageSchema,
}) as z.ZodSchema<IListType>

export const formsFormBuilderSchema = z.object({
  forms: z.array(formSchema),
  form: formSchema.optional(),
  documentTypes: z.array(certificateSchema).optional(),
  inputTypes: z.array(inputTypeSchema).optional(),
  applicantTypes: z.array(applicantTypeSchema).optional(),
  listTypes: z.array(listTypeSchema).optional(),
}) as z.ZodSchema<IFormBuilder>

export const formFormBuilderSchema = z.object({
  forms: z.null(),
  form: formSchema,
  documentTypes: z.array(certificateSchema),
  inputTypes: z.array(inputTypeSchema),
  applicantTypes: z.array(applicantTypeSchema),
  listTypes: z.array(listTypeSchema),
}) as z.ZodSchema<IFormBuilder>
