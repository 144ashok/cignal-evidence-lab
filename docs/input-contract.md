# Experiment JSON input and output

These are local experiment conventions, not canonical CIGNAL or CT schemas. Full runnable examples are in `server/fixtures/scenarios.json`; TypeScript definitions are in `src/types/experiment.ts`. Send a scenario's `input` object to `POST /api/evaluate` with JSON content type, or use the CLI fixture runner.

## Input

| Field | Meaning |
| --- | --- |
| `fixtureId` | Synthetic test/evaluation label; excluded from logical identity and replay fingerprint. |
| `asOf` | Explicit UTC evaluation time. No rule reads the actual clock. |
| `entityId` | Stable synthetic entity identifier. |
| `change.eventId`, `entityId`, `field` | Legal-change identity and changed-field identifier. |
| `change.oldValue`, `newValue` | Values compared after surrounding whitespace is removed. |
| `change.completionStatus` | `completed`, `cancelled`, `pending`, `never_effective`, or null. |
| `change.effectiveAt` | UTC effective time; required for completed events. A future value means not yet effective as of evaluation. |
| `change.completionEvidenceReference`, `completionEvidenceQuality` | Fictional evidence for completion and its explicit fixture quality. |
| `legalRecord`, `managedServices` | Each has `entityId`, `field`, `value`, `evidenceReference`, `observedAt`, `version`, `evidenceQuality`. |
| `service.entityId`, `active` | Identity and `true`, `false`, or null for unknown. |
| `workflow.id`, `entityId` | Identity of the dependent recurring workflow. |
| `workflow.consumesFields` | Known array of field identifiers; `[]` means consumes none, null means unknown. |
| `workflow.preparationAt`, `evidenceReference` | Supplied preparation time and fictional dependency reference. This is not a statutory deadline. |
| `updateTask.status` | `none`, `pending`, `in_progress`, `completed`, `cancelled`, or null. Use `none` for confirmed absence, not null. |
| `updateTask.id`, `owner` | Required to treat a matching active task as managed work. |
| `updateTask.targetEntityId`, `targetChangeId`, `targetField` | Exact task target; an unrelated task cannot suppress a finding. |
| `updateTask.plannedCompletionAt` | Illustrative operational target. Overdue or after-preparation targets require human follow-up. |
| `priorFindingId` | Optional explicit prior-finding hint. Null allows automatic lookup by logical key. If supplied, must match the stored finding. The prior structured record is supplied to the pure evaluator by the local store. |

UTC timestamps must use `YYYY-MM-DDTHH:mm:ssZ`, for example `2026-10-01T00:00:00Z`. Invalid calendar times are unknown evidence. No clock comes from the system date. Preparation exactly at the supplied as-of time is in scope; a task exactly at its target is not yet overdue.

Quality is `verified`, `stale`, `conflicting`, `unverified`, `uncertain`, or null. All source references must start with `fixture://`. No public/government evidence links are fabricated, and no evidence-age cutoff is applied. Snapshot observations cannot follow evaluation; snapshots used to establish the mismatch cannot predate effectiveness.

Each nullable value can explicitly be null. Omitted/malformed values normalize to null and result in `NEEDS_EVIDENCE` if required. An empty string is unknown, not false. Optional task details can be null when task status is `none`; effective time/completion evidence are not required to claim a cancelled or never-effective change. The remaining required evidence still needs to be reliable.

## Baseline

The first fixture uses DEMO-E001, event DEMO-CHANGE-030, field `legal_name`, former name Demo Entity Alpha LLC and current name Demo Entity Beta LLC. Effectiveness is September 22, 2026; both snapshots are observed September 25; service is active; workflow DEMO-WORKFLOW-030 consumes `legal_name`, preparing October 8; evaluation is October 1; no task exists. It produces `READY_FOR_REVIEW`.

## Output

Every result includes `fixtureId`, `findingId` (nullable), `logicalKey` (nullable), `entityId`, `changedField`, `status`, `reason`, `explanation`, `input` (the normalized compared facts), `checks`, `evidence`, `evidenceHistory`, `unresolvedInformation`, `workflow`, `owner`, `action`, `links`, `emissionDisposition`, `isCurrent`, `revision`, `fingerprint` and both authorization flags set to false.

`checks[].passed` is true, false or null (unknown), with an explanation of an observable check. Evidence history contains prior and current references, versions, values and observations. It is not a full activity/audit ledger. `links.taskId` applies only to the matching target; `links.priorFindingId` applies only to the same logical key.

The four status values are `READY_FOR_REVIEW`, `NEEDS_EVIDENCE`, `MONITOR_EXISTING_WORK` and `NO_CURRENT_FINDING`. A no-finding result with no earlier record has no finding ID. A known logical key with missing evidence can have a finding record for evidence follow-up. No entity/workflow key means no emitted logical finding, even when the outcome requires evidence.

Local persistence stores the latest result per key in `state/findings.json` for unscoped API requests. Interactive requests include `?scenario=<fixture-id>` and use separate registries under `state/scenarios/`. The runner uses separate JSON registries under `state/experiment/` for independent scenario series and a mixed-entity batch. Output JSON reports include both expected and actual values rather than treating every result as a pass.

Scenario catalog metadata (`briefCase`, `showInSelector`, `setupFixtureIds`, `setupNote`) describes the test arrangement, not additional business facts or a new finding taxonomy. Only the brief's required cases are selectable. Required earlier findings are evaluated from synthetic setup inputs before the selected case when missing; their logical keys, versions and evidence remain observable in the returned finding and its history.
