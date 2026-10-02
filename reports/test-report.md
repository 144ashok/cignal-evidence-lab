# KO #30 synthetic experiment results

28/28 fixture expectations passed. Batch replay: PASS.

Reproduce with `npm run experiment`. Dates come only from fixture inputs. Each series starts with empty local state; replay and correction cases share their series state.

| Fixture | Expected status | Actual status | Expected emission | Actual emission | Result |
| --- | --- | --- | --- | --- | --- |
| confirmed-mismatch | READY_FOR_REVIEW | READY_FOR_REVIEW | CREATE | CREATE | PASS |
| already-current | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| field-not-consumed | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| service-ended | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| change-cancelled | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| never-effective | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| future-effective | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| missing-new-value | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| missing-completion-evidence | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| identity-mismatch | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| stale-evidence | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| conflicting-evidence | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| unverified-evidence | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| unknown-service | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| pending-owned-task | MONITOR_EXISTING_WORK | MONITOR_EXISTING_WORK | CREATE | CREATE | PASS |
| overdue-task | READY_FOR_REVIEW | READY_FOR_REVIEW | UPDATE | UPDATE | PASS |
| task-correction-verified | NO_CURRENT_FINDING | NO_CURRENT_FINDING | UPDATE | UPDATE | PASS |
| replay-original | READY_FOR_REVIEW | READY_FOR_REVIEW | CREATE | CREATE | PASS |
| replay-identical | READY_FOR_REVIEW | READY_FOR_REVIEW | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| replay-corrected | NO_CURRENT_FINDING | NO_CURRENT_FINDING | UPDATE | UPDATE | PASS |
| replay-resolved-again | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| similar-name-other-entity | NO_CURRENT_FINDING | NO_CURRENT_FINDING | NO_NEW_NOTIFICATION | NO_NEW_NOTIFICATION | PASS |
| task-unrelated | READY_FOR_REVIEW | READY_FOR_REVIEW | CREATE | CREATE | PASS |
| task-unowned | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| task-completed-still-stale | READY_FOR_REVIEW | READY_FOR_REVIEW | CREATE | CREATE | PASS |
| task-after-preparation | READY_FOR_REVIEW | READY_FOR_REVIEW | CREATE | CREATE | PASS |
| future-observation | NEEDS_EVIDENCE | NEEDS_EVIDENCE | CREATE | CREATE | PASS |
| batch-second-entity | READY_FOR_REVIEW | READY_FOR_REVIEW | CREATE | CREATE | PASS |

Full compared facts, checks, unresolved information, workflow, evidence versions, linkage, permissions and recommended human actions are retained in [results.json](results.json). The mixed-entity replay is in [batch-replay.json](batch-replay.json).

## Observable results

### confirmed-mismatch

**READY_FOR_REVIEW / CREATE** — STALE_MANAGED_SERVICES_VALUE

A completed, effective legal change is verified, the related service retains the old value, and an upcoming workflow consumes the field. No matching task is verified as on track.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### already-current

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — RECORDS_ALIGNED

The verified Managed Services snapshot holds the current legal value. Any earlier finding for this logical key is no longer current.

Entity: DEMO-E001; field: legal_name; finding: none; revision: 0.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Beta LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- PASS: Managed Services Value Current — Service snapshot matches the new legal value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### field-not-consumed

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — FIELD_NOT_CONSUMED

A known prerequisite is not met at the supplied evaluation time. No unresolved issue is established for this operational scenario; no conclusion is made about other legal obligations.

Entity: DEMO-E001; field: legal_name; finding: none; revision: 0.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- FAIL: Workflow Uses Field — Consumed fields: (none).
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### service-ended

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — SERVICE_INACTIVE

A known prerequisite is not met at the supplied evaluation time. No unresolved issue is established for this operational scenario; no conclusion is made about other legal obligations.

Entity: DEMO-E001; field: legal_name; finding: none; revision: 0.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- FAIL: Service Active — Relevant service active: false.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### change-cancelled

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — CHANGE_CANCELLED

A known prerequisite is not met at the supplied evaluation time. No unresolved issue is established for this operational scenario; no conclusion is made about other legal obligations.

Entity: DEMO-E001; field: legal_name; finding: none; revision: 0.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- FAIL: Legal change completed — Supplied completion status: cancelled.
- FAIL: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### never-effective

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — CHANGE_NOT_EFFECTIVE

A known prerequisite is not met at the supplied evaluation time. No unresolved issue is established for this operational scenario; no conclusion is made about other legal obligations.

Entity: DEMO-E001; field: legal_name; finding: none; revision: 0.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- FAIL: Legal change completed — Supplied completion status: never_effective.
- FAIL: Legal Change Effective — Effective: unknown; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed not applicable.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### future-effective

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — CHANGE_NOT_EFFECTIVE

A known prerequisite is not met at the supplied evaluation time. No unresolved issue is established for this operational scenario; no conclusion is made about other legal obligations.

Entity: DEMO-E001; field: legal_name; finding: none; revision: 0.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- FAIL: Legal Change Effective — Effective: 2026-10-02T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-10-02T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### missing-new-value

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “unknown”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: Old and new legal values are required. The legal snapshot contradicts the completed new value.

- FAIL: Evidence sufficient — Old and new legal values are required. The legal snapshot contradicts the completed new value.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- UNKNOWN: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- UNKNOWN: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### missing-completion-evidence

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 3.

Unresolved: Legal completion evidence is missing.

- FAIL: Evidence sufficient — Legal completion evidence is missing.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### identity-mismatch

**NEEDS_EVIDENCE / CREATE** — IDENTITY_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: Entity identifiers must be known and match across the event, both snapshots, service and workflow.

- FAIL: Evidence sufficient — Entity identifiers must be known and match across the event, both snapshots, service and workflow.
- FAIL: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### stale-evidence

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: Legal record evidence is missing, stale, conflicting or unverified.

- FAIL: Evidence sufficient — Legal record evidence is missing, stale, conflicting or unverified.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### conflicting-evidence

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: Managed Services evidence is missing, stale, conflicting or unverified.

- FAIL: Evidence sufficient — Managed Services evidence is missing, stale, conflicting or unverified.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### unverified-evidence

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: Legal completion evidence is not verified.

- FAIL: Evidence sufficient — Legal completion evidence is not verified.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### unknown-service

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: Relevant service activity is unknown.

- FAIL: Evidence sufficient — Relevant service activity is unknown.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- UNKNOWN: Service Active — Relevant service active: unknown.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### pending-owned-task

**MONITOR_EXISTING_WORK / CREATE** — MATCHING_OWNED_TASK_ON_TRACK

A supported mismatch remains, but a matching, owned correction task is pending within its target and before workflow preparation. The task is not evidence of completed correction.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Monitor the linked task and verify a new service snapshot after completion. Do not create duplicate outreach.

Linked task: DEMO-TASK-030; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- PASS: Matching owned task on track — Task DEMO-TASK-030, owned by Managed Services owner (illustrative), is due 2026-10-03T00:00:00Z. Correction is not yet verified.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### overdue-task

**READY_FOR_REVIEW / UPDATE** — CORRECTION_TASK_OVERDUE

The matching task has passed its illustrative completion target and the verified mismatch remains. Human follow-up is required; no legal urgency is inferred.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 2.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-04T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: DEMO-TASK-030; prior finding: F-030-4a272e58a1a4416a0066; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-04T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### task-correction-verified

**NO_CURRENT_FINDING / UPDATE** — CORRECTION_VERIFIED

The verified Managed Services snapshot holds the current legal value. Any earlier finding for this logical key is no longer current.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 3.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Beta LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-06T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: DEMO-TASK-030; prior finding: F-030-4a272e58a1a4416a0066; evidence versions retained: 5.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-06T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- PASS: Managed Services Value Current — Service snapshot matches the new legal value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v2; version v2; observed 2026-10-05T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### replay-original

**READY_FOR_REVIEW / CREATE** — STALE_MANAGED_SERVICES_VALUE

A completed, effective legal change is verified, the related service retains the old value, and an upcoming workflow consumes the field. No matching task is verified as on track.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### replay-identical

**READY_FOR_REVIEW / NO_NEW_NOTIFICATION** — STALE_MANAGED_SERVICES_VALUE

A completed, effective legal change is verified, the related service retains the old value, and an upcoming workflow consumes the field. No matching task is verified as on track.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: none; prior finding: F-030-4a272e58a1a4416a0066; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### replay-corrected

**NO_CURRENT_FINDING / UPDATE** — CORRECTION_VERIFIED

The verified Managed Services snapshot holds the current legal value. Any earlier finding for this logical key is no longer current.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 2.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Beta LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-06T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: F-030-4a272e58a1a4416a0066; evidence versions retained: 5.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-06T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- PASS: Managed Services Value Current — Service snapshot matches the new legal value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v2; version v2; observed 2026-10-05T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### replay-resolved-again

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — CORRECTION_VERIFIED

The verified Managed Services snapshot holds the current legal value. Any earlier finding for this logical key is no longer current.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 2.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Beta LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-06T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: F-030-4a272e58a1a4416a0066; evidence versions retained: 5.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-06T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- PASS: Managed Services Value Current — Service snapshot matches the new legal value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v2; version v2; observed 2026-10-05T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### similar-name-other-entity

**NO_CURRENT_FINDING / NO_NEW_NOTIFICATION** — RECORDS_ALIGNED

The verified Managed Services snapshot holds the current legal value. Any earlier finding for this logical key is no longer current.

Entity: DEMO-E002; field: legal_name; finding: none; revision: 0.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Beta LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-031; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): No correction is recommended by this experiment. Retain the evidence and re-evaluate if the facts change.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- PASS: Managed Services Value Current — Service snapshot matches the new legal value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E002/031; version DEMO-CHANGE-031; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E002/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E002/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E002/031; version DEMO-WORKFLOW-031; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### task-unrelated

**READY_FOR_REVIEW / CREATE** — STALE_MANAGED_SERVICES_VALUE

A completed, effective legal change is verified, the related service retains the old value, and an upcoming workflow consumes the field. No matching task is verified as on track.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### task-unowned

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: DEMO-TASK-030; prior finding: none; evidence versions retained: 4.

Unresolved: A matching active task must have an identifier and owner.

- FAIL: Evidence sufficient — A matching active task must have an identifier and owner.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### task-completed-still-stale

**READY_FOR_REVIEW / CREATE** — COMPLETED_TASK_STILL_STALE

A completed, effective legal change is verified, the related service retains the old value, and an upcoming workflow consumes the field. No matching task is verified as on track.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: DEMO-TASK-030; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### task-after-preparation

**READY_FOR_REVIEW / CREATE** — TASK_TARGET_AFTER_WORKFLOW

The matching task is planned after workflow preparation while the service value remains stale. A human should review the schedule.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: DEMO-TASK-030; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### future-observation

**NEEDS_EVIDENCE / CREATE** — REQUIRED_EVIDENCE_UNCERTAIN

The supplied facts do not reliably establish this operational issue. The unresolved information lists the checks that need attention.

Entity: DEMO-E001; field: legal_name; finding: F-030-4a272e58a1a4416a0066; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-030; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Verify the listed facts and fictional source snapshots, then evaluate again. Do not infer identity from a similar name.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: Managed Services observation is later than the evaluation time.

- FAIL: Evidence sufficient — Managed Services observation is later than the evaluation time.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E001/030; version DEMO-CHANGE-030; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E001/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E001/v1; version v1; observed 2026-10-02T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E001/030; version DEMO-WORKFLOW-030; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

### batch-second-entity

**READY_FOR_REVIEW / CREATE** — STALE_MANAGED_SERVICES_VALUE

A completed, effective legal change is verified, the related service retains the old value, and an upcoming workflow consumes the field. No matching task is verified as on track.

Entity: DEMO-E003; field: legal_name; finding: F-030-72a5b62aabbba257e874; revision: 1.

Compared: legal value “Demo Entity Beta LLC”; service value “Demo Entity Alpha LLC”; expected value “Demo Entity Beta LLC”.

Workflow: DEMO-WORKFLOW-032; preparation: 2026-10-08T00:00:00Z; as-of: 2026-10-01T00:00:00Z.

Human next step (Managed Services owner (illustrative)): Ask the illustrative Managed Services owner to review the evidence and arrange or follow up the correction before workflow preparation. Verify the resulting snapshot.

Linked task: none; prior finding: none; evidence versions retained: 4.

Unresolved: none

- PASS: Evidence sufficient — Required facts and fixture-declared evidence are verified; no evidence-age threshold is applied.
- PASS: Entity identities match — Compare explicit entity IDs across the event, snapshots, service and workflow; names are never join keys.
- PASS: Legal change completed — Supplied completion status: completed.
- PASS: Legal Change Effective — Effective: 2026-09-22T00:00:00Z; evaluation: 2026-10-01T00:00:00Z.
- PASS: Legal Record Current — Compare the legal snapshot value with the new legal value.
- PASS: Service Active — Relevant service active: true.
- PASS: Workflow Uses Field — Consumed fields: legal_name.
- PASS: Workflow preparation upcoming — Preparation: 2026-10-08T00:00:00Z; this is not a statutory deadline.
- FAIL: Managed Services Value Current — Service snapshot still holds the old value.
- FAIL: Matching owned task on track — No matching owned task is verified as on track before preparation.

- Evidence: fixture://change/DEMO-E003/032; version DEMO-CHANGE-032; observed 2026-09-22T00:00:00Z.
- Evidence: fixture://legal/DEMO-E003/v2; version v2; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://managed-services/DEMO-E003/v1; version v1; observed 2026-09-25T00:00:00Z.
- Evidence: fixture://workflow/DEMO-E003/032; version DEMO-WORKFLOW-032; observed not applicable.

`customer_communication_authorized=false`; `source_record_write_authorized=false`.

Passing synthetic tests establishes only agreement with these fixtures. It does not demonstrate production accuracy, legal correctness, CT integration, time savings or commercial value.
