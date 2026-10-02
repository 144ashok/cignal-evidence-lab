# CIGNAL Evidence Lab

A standalone **rules-based experiment over synthetic facts** for Knowledge Object #30, “Legal Change Completed but Managed Services Data Remains Stale.” Core value: **Protect + Serve**; no commercial follow-on is defined.

This research contribution is not Wally, the full CIGNAL platform, a production backend, or a prerequisite for the main demo. It does not implement legal reasoning, AI extraction, customer outreach or CT integration. Kevin retains product, architecture, brand, presentation and demo decisions.

## Clean local setup

Use Node.js 22.18+ (tested with Node 24.11.1) and npm. In this folder:

```sh
npm ci
```

The lock file pins dependencies. Package installation requires access to the package registry; runtime uses only local files and a loopback HTTP server. Do not omit dev dependencies: the local Node server uses the installed `tsx` loader to share the TypeScript evaluator with tests.

Run the complete experiment and generate inspectable reports with one command:

```sh
npm run experiment
```

Run automated tests:

```sh
npm test
```

Reset local experiment and interactive finding state:

```sh
npm run reset
```

Stop the interactive server before using the reset command. To reset while the app runs, use **Reset local finding state** in the UI. Reset removes no fixture inputs or reports; it writes empty finding registries. The experiment runner always starts its own series with empty state for reproducible reports and leaves interactive history untouched.

## Optional React interface

```sh
npm run dev
```

Open http://127.0.0.1:3000. Node owns the port, serves the local API and uses Vite middleware for React hot reload. Select a synthetic scenario, inspect or edit its structured facts, then click **Run evaluation**. Expanding the metadata sections exposes snapshot IDs, evidence, versions, observations and task ownership/targets. Blank and “Unknown” values remain unknown.

For a built frontend served by Node without Vite:

```sh
npm run build
npm start
```

`npm run preview` also serves the built frontend through Node. Set `PORT` to change port 3000. Run only one server on a port. No long-running server is needed for `npm test` or `npm run experiment`.

The three panels show supplied facts, observable checks and the evaluated finding. Findings show unresolved information, workflow timing, task and prior-finding links, retained evidence and emission disposition. Editing inputs does not silently change the evaluated snapshot. Local history survives reloads and server restarts.

Independent UI scenarios share history by logical key. Reset history before evaluating an unrelated alternative for the same entity/change/workflow. For a replay sequence, keep the state: run **Original logical finding**, **Identical facts replayed**, **New snapshot resolves earlier finding**, then **Verified correction replayed**. The CLI automatically isolates independent series.

## Deliverables and comparison

- [Requirement comparison](docs/requirement-comparison.md): what was already present, what the expanded brief added, and where each requirement is implemented.
- [Input/output contract](docs/input-contract.md): experiment-only schema and interpretation of unknown values.
- [Expected-versus-actual report](reports/test-report.md): all fixture outcomes and observable checks.
- [JSON results](reports/results.json): every evaluated fixture with evidence and linkage.
- [Mixed-entity replay results](reports/batch-replay.json): small batch duplicate test.
- [Findings note](docs/findings.md): essential facts, uncertainties, limitations and reuse.

All schemas and statuses are experiment conventions, not canonical CIGNAL schemas or CT interfaces. The September/October 2026 times are fictional; workflow preparation is not a statutory annual-report deadline.

## Local API

| Request | Behavior |
| --- | --- |
| `GET /api/fact-options` | Returns dropdown options from `server/fixtures/fact-options.json`. |
| `GET /api/scenarios` | Returns synthetic structured inputs and independently declared expectations. |
| `POST /api/evaluate` | Accepts one JSON evaluation input, evaluates it against the local prior finding, saves the result and returns it. |
| `GET /api/findings` | Returns the current revision of each local logical finding, including resolved entries and retained evidence. |
| `POST /api/reset` | Accepts `{}` and clears interactive finding state only. |

POST requests use `Content-Type: application/json`. Invalid JSON returns HTTP 400; valid JSON with missing or uncertain facts returns `NEEDS_EVIDENCE`. No API changes fixture source records or sends messages. There is no database, authentication, external runtime API or AI/LLM call.

## Rules and assumptions

1. Validate explicit identities, known values, source references, versions, quality and supplied UTC times. Missing/malformed facts, mismatched identities, future observations, stale/conflicting/unverified evidence and unexplained service values require evidence.
2. A known inactive service, unused field, cancelled/incomplete/never-effective or future-effective change, no actual value change, past preparation, or current service value produces no current operational finding when the required evidence is reliable.
3. A supported stale value with a matching, owned pending/in-progress task is monitored when the target is at or after evaluation and no later than preparation. A task alone never establishes resolution.
4. An overdue matching task, a target after preparation, or a completed task with an unresolved mismatch returns to human review. These are illustrative operational targets, not legal urgency.
5. Without an applicable on-track task, a verified mismatch and upcoming dependent workflow are ready for human review.

Comparisons trim surrounding whitespace and are case-sensitive. IDs—not names—establish entity identity. Evidence quality is explicitly supplied: no CT-wide evidence-age threshold is invented. The completion evidence time is represented by the event's effective time; separate snapshots have explicit observation times. A same-version changed value, a changed value without a later observation, or evidence older than the retained history needs verification. Conflicting submissions remain in history; repeating them cannot verify a correction. Supply a coherent newer version or reset the synthetic experiment to investigate a separate alternative.

Logical identity is the tuple **entity ID + change event ID + field + workflow ID**. Evidence versions are separate. Finding IDs use a deterministic truncated SHA-256 digest of this tuple; the full tuple is stored as the lookup key. A semantic fingerprint excludes the fixture label and optional prior-finding hint. An unchanged replay keeps the ID/revision and returns `NO_NEW_NOTIFICATION`; changed facts update the same record. A newer verified corrected snapshot marks that earlier finding no longer current, retaining both evidence versions. A newer supported regression can reopen it.

`CREATE`, `UPDATE` and `NO_NEW_NOTIFICATION` describe local finding emission decisions. Nothing is sent to a customer or employee. Every result includes `customer_communication_authorized=false` and `source_record_write_authorized=false`. A `NO_CURRENT_FINDING` evaluation without an earlier finding creates no finding record. A result without enough identity to form a logical key likewise emits no notification.

## Source structure

```text
src/main.tsx                  React startup only
src/App.tsx                   UI state and page composition
src/components/               Typed panels, fields, and layout components
src/api/                      Local HTTP clients
src/hooks/                    Fetch/loading/retry state
src/types/experiment.ts       Input, evidence, task, finding and fixture types
src/types/factOptions.ts      Dropdown response types
src/domain/normalizeInput.ts  Unknown-preserving input normalization
src/engine.ts                 Pure supplied-clock evaluator (runs in Node)
src/engine.test.ts            Rules, identity, replay and correction tests
server/app.mjs                API routes and React serving
server/index.mjs              Node startup/shutdown
server/finding-store.mjs      Serialized local JSON finding persistence
server/fixtures/              Fictional input and option JSON
server/*.test.mjs             HTTP and persistence integration tests
scripts/run-experiment.mjs    Deterministic report and batch runner
scripts/reset-state.mjs       Empty local state registries
scripts/create-fixtures.mjs   Rebuild checked-in synthetic fixtures
state/                       Generated local JSON; ignored by version control
reports/                     Generated results included in the deliverable
docs/                        Contract, comparison and findings note
```

## Limits

This is a narrow single-process, local experiment. It does not support multiple server processes sharing a state file, distributed transactions, durable notification delivery, real task ownership verification or production access control. Evidence history retains compared evidence, not every historical task revision. The schema accepts supplied facts; “verified” is a fixture assertion, not an independent source verification.

Passing synthetic tests establishes only agreement with these fixtures. It does not establish production accuracy, legal correctness, actual CT integration, time savings or commercial value. Browser rendering has not been manually audited; automated validation covers the evaluator, HTTP API, local persistence and build.
