# HH course registration — Zendesk custom objects

Registrations for Heilsugæsla höfuðborgarsvæðisins courses are written to
Zendesk twice: as a ticket (what the service desk works in) and as custom
object records (structured data that can be queried and reported on).

The records are a **snapshot of the registration at the moment it was made**.
They are deliberately not kept in sync with later Contentful edits — if an
editor renames a course or moves a date afterwards, the existing registrations
keep the values the person actually signed up for. Only a new registration for
the same course or instance refreshes the shared `hh_course` /
`hh_course_instance` records.

## Objects

Records are upserted by `external_id`, so re-submitting is idempotent.

### `hh_course` — external_id: Contentful course entry id

| Field key | Type | Notes |
| --- | --- | --- |
| `course_url` | Text | `https://island.is/s/hh/<list page slug>/<course id>` |
| `course_slug` | Text | |
| `course_intro` | Multi-line text | Plain text of the Contentful card intro |
| `course_categories` | Text | Comma separated category titles |
| `course_organization` | Text | Owning organization title |

### `hh_course_instance` — external_id: Contentful course instance entry id

| Field key | Type | Notes |
| --- | --- | --- |
| `course_start_date` | Date | |
| `course_start_time` | Text | `09:00 - 12:00`, or just the start time |
| `course_description` | Multi-line text | |
| `course_price` | Decimal | From the FJS catalog; omitted when unknown |
| `course_location` | Text | |
| `course_url` | Text | |
| `course_charge_item_code` | Text | Empty for free courses |
| `course_max_registrations` | Integer | Omitted when the course has no cap |
| `course_id` | Lookup → `hh_course` | |
| `course` | Lookup → `hh_course` | |

### `hh_course_registration` — external_id: island.is application id

One record per application.

| Field key | Type |
| --- | --- |
| `application_id` | Text |
| `applicant_name` | Text |
| `applicant_kennitala` | Text |
| `applicant_email` | Text |
| `applicant_phone` | Text |
| `applicant_healthcenter` | Text |
| `applicant_workplace` | Text |
| `applicant_job_title` | Text |
| `payer_name` | Text |
| `payer_kennitala` | Text |
| `paid_as_individual` | Checkbox |
| `participant_count` | Integer |
| `ticket_id` | Integer |
| `course_instance` | Lookup → `hh_course_instance` |
| `course_instance_external_id` | Text |

The three payer fields are only written for courses that have a charge item
code; free courses have no payer.

### `hh_course_participant` — external_id: `<course instance id>-<kennitala>`

| Field key | Type |
| --- | --- |
| `kennitala` | Text |
| `email` | Text |
| `participant_phone` | Text |
| `workplace` | Text |
| `job_title` | Text |
| `ticket_id` | Integer |
| `course_instance` | Lookup → `hh_course_instance` |
| `course_instance_external_id` | Text |
| `registration` | Lookup → `hh_course_registration` |

## `course_instance_external_id`

Both `hh_course_registration` and `hh_course_participant` carry a plain text
copy of the Contentful course instance id alongside the `course_instance`
lookup. Zendesk lookup fields hold the *record* id, so without the text copy
every query by course instance needs an extra round trip to resolve the
instance record first. With it, registrations for an instance are one filtered
search:

```
POST /api/v2/custom_objects/hh_course_participant/records/search?query=*
{ "filter": { "$and": [{ "course_instance_external_id": { "$eq": "<id>" } }] } }
```

Nothing queries it yet — availability still counts registrations by parsing
national ids out of ticket descriptions, in `checkParticipantAvailability` here
and in `getCourseAvailability` in `libs/api/domains/course-charges`. Moving
those onto this field is a separate change, and needs a backfill story for
registrations made before these records existed.

## Adding a field

Zendesk rejects the whole upsert with a 422 if a record references a field key
that does not exist on the object, so create the field in Zendesk admin
(**Objects and rules → Custom objects**) before deploying code that writes it.
