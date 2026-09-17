# Lessons

## Don't derive design measurements from scaled screenshots

Twice on the pay-debts sticky footer I offered pixel-derived alternatives (64px for
text alignment, 72px for Figma cell padding) against a stated rule ("left padding
follows the 56px first column"). Both were wrong. A cropped retina screenshot gives no
reliable scale factor -- estimating it from a checkbox of unknown intrinsic size put my
answer anywhere between 56 and 72.

**Why:** the designer reading the Figma file is authoritative about the rule. Pixel
arithmetic on a screenshot is not evidence strong enough to question it.

**How to apply:** when a design instruction names a constant, implement it literally
and only ask if something in the _code_ contradicts it -- not because an image looks a
few pixels off. Ask which element the offset is measured from if that is unclear;
don't offer a menu of derived numbers.

## Prefer the meaningful constant over DOM measurement

The footer originally measured `thead th` positions to align itself. That mixed
viewport coordinates with container coordinates and broke whenever the table scrolled
horizontally. The number it was recovering (56) was a constant in
`InteractiveTableFormField.css.ts` all along.

**Why:** measurement code invents failure modes -- scroll offsets, timing, hidden
elements -- to rediscover a value the codebase already states.

**How to apply:** before writing measurement code, check whether the quantity is
already a named constant or expressible as config.

## Trace a generated-artifact type error back to the generator, not the file

`libs/api/domains/application/src/lib/utils.ts` reported five TS7053 errors about
`ApplicationResponseDtoTypeIdEnum.PayDebts` not existing in `ApplicationConfigurations`
or `institutionMapper`. `PayDebts` was in no tracked source on the branch -- only in
two gitignored artifacts: `apps/application-system/api/src/openapi.yaml` and the
`gen/fetch` client generated from it, both left over from a pay-debts branch.

Re-running the codegen appeared to do nothing because
`application-system-api:codegen/backend-schema` was _failing_, and nx reports the
failure well below the visible tail of the output. The real cause was an unrelated
one-character typo in the working tree -- `extraInformation` renamed to
`extraInformration` in `secondary-school/src/lib/dataSchema.ts` -- which broke
`secondary-school.service.ts`, which broke the whole-app compile that `buildOpenApi.ts`
performs, which left `openapi.yaml` stale.

**Why:** `buildOpenApi.ts` bootstraps the entire Nest app, so _any_ type error anywhere
in the app silently freezes every downstream generated client at its previous contents.
The error then surfaces in a file that has nothing to do with the change.

**How to apply:** when a type error names a symbol that `git grep` cannot find in
tracked source, suspect a stale generated artifact -- check mtimes first. If a codegen
"did nothing", confirm it actually succeeded rather than assuming a cache hit; run it
with `--skip-nx-cache` and read the head of the output, not the tail. Fix the compile
error the generator trips over before touching the file that reported the symptom.

**Also:** distinguish a stale _TS server_ (disk is correct, real `tsc` passes -- restart
fixes it) from a stale _artifact on disk_ (real `tsc` reproduces -- a restart cannot
help). Run `tsc` against a tsconfig extending `tsconfig.base.json` to tell them apart.

## Get the log line before theorising about which call failed

An external-data failure surfaced as a bare `statusCode: 404`. I inferred from response
shapes which of two `Promise.all` calls was responsible, and picked the wrong one. The
server log named it outright (`endpoint: 'dayRateEntriesPeriodsGet'`) and took ten
seconds to read.

**Why:** response-shape reasoning ("single-resource GETs 404 when empty") is a plausible
prior, not evidence. Acting on it produced a real change to the submit path that would
have weakened a double-reporting guard, for a 404 that never happened.

**How to apply:** when several calls share an error path, ask for the log line first --
each `.catch` here already logged a distinct endpoint name. Do not harden a call until
its failure is observed.

## Unauthenticated probing tells you if a route exists

To find whether `GET /api/DayRate/entries/{EntityId}/periods/{Period}` was reachable, I
hit the local X-Road proxy with only the `X-Road-Client` header. An existing route
answers 401, a missing one 404 -- so status codes alone map the surface without any
token. Varying the path parameter mattered too: `2026-8` (failing the route constraint)
returned 401 by falling through to `{Permno}/{Id}`, while `2026-08` reached the real
handler and failed. That isolated the fault to one handler rather than the route,
the auth, the kennitala, or the period format.

**Why:** it separates "island.is is calling it wrong" from "the endpoint is broken"
in seconds, which is otherwise a long round-trip with the service owner.

**How to apply:** probe siblings for a baseline, probe the failing path, and vary the
parameter to see where the behaviour changes. Also re-sample before concluding -- this
endpoint moved from a consistent 404 to a consistent 500 mid-session, which would have
made a single sample misleading. Fetching the service's own `/swagger/v1/swagger.json`
through the proxy confirmed the local `clientConfig.json` was accurate.
