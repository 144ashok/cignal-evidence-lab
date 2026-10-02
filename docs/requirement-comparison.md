# Comparison with the expanded brief

The original prompt and the expanded brief describe the same KO #30 business problem, four outcomes, synthetic data and human authorization boundary. They are **not the same implementation specification**. The original request focused on editable facts and a three-panel demonstration. The expanded brief adds identity, evidence provenance, workflow timing, correction-task matching, persistent duplicate handling and reproducible research artifacts. The React interface was already requested and is retained; the new brief does not require extra visual polish.

| Requirement | Before this update | Completed implementation |
| --- | --- | --- |
| Standalone local lab, fictional data, no external runtime calls or AI | Present | Retained; Node local API and React stay in this folder. |
| Four outcome statuses and human-only recommendations | Present | Retained with more precise observable checks. |
| Both authorization flags always false | Present | Preserved in every evaluator output, including missing-evidence cases. |
| Completion and effective time | Completion checkbox/state and date-only evaluation | Structured event ID, status, effective UTC time and completion evidence. |
| Legal and service snapshot identity, observation time, version and evidence | Flat values and descriptive references | Explicit snapshot metadata with fictional `fixture://` references and quality. |
| Explicit unknowns; absent is not false | Boolean/select fields could not represent all unknowns | Null-preserving normalization and unknown UI options; malformed values become unknown. |
| Entity identifiers matched across sources | Not implemented | IDs checked across event, both snapshots, workflow and service; never name joins. |
| Dependent workflow ID, consumed fields and preparation time | Boolean dependency and workflow date | Structured workflow with exact consumed fields and UTC preparation time. |
| Owned correction task, target change and planned completion | Task state only | Explicit task owner, target entity/event/field and planned completion. |
| On-track work monitored; overdue work reviewed | Every active task suppressed review | Matching owned on-track tasks monitored; overdue or late targets require review. |
| Stable logical identity independent of evidence versions | ID hashed all supplied facts | Logical key uses entity, event, field and workflow; versions retained separately. |
| Prior finding record survives replay and restart | No persistent finding record | Local JSON store, deterministic revision handling and serialized requests. |
| Duplicate suppression | Re-running made another standalone evaluation | Identical replay uses the same ID/revision and `NO_NEW_NOTIFICATION`. |
| Verified correction updates earlier finding | Resolved checkbox suppressed a finding | Newer verified snapshot updates the earlier ID as not current; prior evidence retained. |
| Unresolved information, workflow and work/prior links, emission disposition | Partially present in prose | Structured fields in outputs, UI and reports. |
| Minimum 12 tests plus similarly named different entity negative test | General rule tests; no persistence/identity lifecycle | Every specified case plus malformed/unknown input, task matching, temporal checks, batch replay and API tests. |
| JSON results for every fixture and expected-versus-actual report | Download one result only | `npm run experiment` generates `reports/results.json` and `reports/test-report.md`. |
| One-page findings note | Missing | `docs/findings.md`. |
| One command each to run experiment, tests and reset | UI/build/test commands only | `npm run experiment`, `npm test`, `npm run reset`. |
| Small synthetic batch replay | Missing | Separate report verifies independent entity keys and no duplicate replay notifications. |

Implementation choices requiring no integration: evidence quality is fixture-declared; times use UTC; the local state file is not a database server; the runner isolates independent scenario series. These are documented experiment conventions, not new CT-wide policies.

The UI selector now directly maps to the brief's 12 tests and negative identity case, splitting the stated alternatives into 16 choices. Extra boundary tests remain outside the dropdown. Each selected case shows its specific description, expected initial result and any required prior-finding setup. Independent cases have isolated local histories; recurring evaluations of one case retain the same logical finding. All field options are supplied by Node from JSON and use the brief's legal-name example, task/evidence states and explicit unknown values.

The brief's governance and independence requirements remain intact: no other repository or brand asset was edited, and no production credentials or customer information were used. The repository/folder and ZIP can be inspected independently of the main demo.
