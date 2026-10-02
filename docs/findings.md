# KO #30 experiment findings

The experiment distinguishes a supported operational mismatch from evidence gaps, owned correction work and replayed findings using supplied synthetic facts. It remains a rules-based contribution for inspection; it does not implement Wally, enterprise integration or legal reasoning. Its value proposition is Protect + Serve, with no commercial follow-on defined.

## What worked

The confirmed baseline produces a reviewable finding with explicit comparisons and a human next step. Known inactive services, unused fields and ineffective changes produce no current finding for this narrow workflow. Unknown or conflicting facts remain evidence gaps. A matching owned task on track yields monitoring; passing its illustrative target while the mismatch remains yields human follow-up. A completed task alone does not verify correction.

Logical identity separated from evidence versions is essential. Replaying unchanged facts returns the same finding ID and revision with `NO_NEW_NOTIFICATION`. A newer verified corrected snapshot updates the earlier record as no longer current and retains the previous service evidence. A small mixed-entity batch confirms that a similarly named different entity neither inherits the first entity's finding nor blocks another entity's independent finding. The generated report contains the actual fixture outcomes and is reproducible from the supplied files.

## Which structured facts were essential

Entity, event, field and workflow IDs establish what the issue concerns. Reliable completion evidence plus effective and as-of times establishes whether the event is in scope. Both snapshot values, entity IDs, observations, references, quality flags and versions establish what can be compared. Workflow consumed fields and preparation time establish operational relevance. Task target, status, owner and planned completion separate managed work from absent, unrelated, unowned or overdue work. Prior logical state provides replay suppression and correction continuity.

Names alone cannot identify the entity. A “resolved” checkbox cannot substitute for evidence of a corrected value. Unknown service activity must not become inactive by default. Those were material limitations in the earlier UI-focused prototype, now addressed by the structured input and evaluator.

## Which uncertainties require human review

Unverified completion, conflicting snapshots, explicit staleness, missing IDs, unexplained third values and uncertain ownership block a supported conclusion. A changed value without a changed evidence version or later observation also requires evidence. The experiment exposes these gaps rather than inventing a narrative or source verification. A human reviews supported mismatches and overdue operational work; no automatic update or communication is authorized.

## What remains untested

Synthetic fixtures cannot establish production accuracy, legal correctness, actual CT integration, time savings or commercial value. “Verified” is declared by a fixture, not checked against a real source. No CT-wide evidence-age threshold, real-world calendar policy, name-normalization policy or legal urgency is modeled. Browser rendering has not been manually audited. Multi-process contention, crash recovery across storage systems, access control, notification delivery and real task ownership remain outside scope. The local store serializes requests within one process and retains evidence history, but does not provide a full transactional activity ledger. Reusing it as a production persistence layer would be inappropriate.

## What could be reused

The supplied-clock evaluator, explicit unknown handling, logical-key/evidence-version separation, human authorization flags and fixture-driven replay tests could inform later design decisions. The input conventions themselves are not proposed as canonical CIGNAL schemas. Handling multiple findings beyond this small batch would require validated upstream identity, explicit workflow policy, concurrency-safe storage, lifecycle/audit policy and delivery idempotency. Those decisions can be considered independently of the main demo, with product and architecture ownership retained by Kevin.
