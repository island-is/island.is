// This file is auto-generated. Do not edit directly.

import { z } from "zod"

export const nxProjectSchema = z.object({ "name": z.string().describe("Project's name. Optional if specified in workspace.json").optional(), "root": z.string().describe("Project's location relative to the root of the workspace").optional(), "sourceRoot": z.string().describe("The location of project's sources relative to the root of the workspace").optional(), "projectType": z.enum(["library","application"]).describe("Type of project supported").optional(), "generators": z.record(z.any()).describe("List of default values used by generators").optional(), "namedInputs": z.record(z.any()).describe("Named inputs used by inputs defined in targets").optional(), "targets": z.record(z.object({ "executor": z.string().describe("The function that Nx will invoke when you run this target").optional(), "options": z.record(z.any()).optional(), "outputs": z.array(z.string()).optional(), "defaultConfiguration": z.string().describe("The name of a configuration to use as the default if a configuration is not provided").optional(), "configurations": z.record(z.record(z.any())).describe("provides extra sets of values that will be merged into the options map").optional(), "inputs": z.any().optional(), "dependsOn": z.array(z.any().superRefine((x, ctx) => {
    const schemas = [z.string(), z.object({ "projects": z.any().superRefine((x, ctx) => {
    const schemas = [z.string().describe("A project name"), z.array(z.string()).describe("An array of project names")];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  }).optional(), "dependencies": z.boolean().optional(), "target": z.string().describe("The name of the target.").optional(), "params": z.enum(["ignore","forward"]).describe("Configuration for params handling.").default("ignore") }).strict().and(z.any().superRefine((x, ctx) => {
    const schemas = [z.any(), z.any(), z.any().refine((value) => !z.union([z.any(), z.any()]).safeParse(value).success, "Invalid input: Should NOT be valid against schema")];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  }))];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  })).optional(), "command": z.string().describe("A shorthand for using the nx:run-commands executor").optional(), "cache": z.boolean().describe("Specifies if the given target should be cacheable").optional(), "parallelism": z.boolean().describe("Whether this target can be run in parallel with other tasks").default(true), "metadata": z.object({ "description": z.string().describe("A description of the target").optional() }).catchall(z.any()).describe("Metadata about the target").optional(), "syncGenerators": z.array(z.string()).describe("List of generators to run before the target to ensure the workspace is up to date").optional() })).describe("Configures all the targets which define what tasks you can run against the project").optional(), "tags": z.array(z.string()).optional(), "implicitDependencies": z.array(z.string()).optional(), "metadata": z.object({ "description": z.string().describe("A description of the project.").optional() }).catchall(z.any()).describe("Metadata about the project.").optional(), "release": z.object({ "version": z.object({ "generator": z.string().describe("The version generator to use. Defaults to @nx/js:release-version.").optional(), "generatorOptions": z.record(z.any()).describe("Options for the version generator.").optional() }).describe("Configuration for the nx release version command.").optional() }).describe("Configuration for the nx release commands.").optional() })
export type NxProjectSchema = z.infer<typeof nxProjectSchema>
