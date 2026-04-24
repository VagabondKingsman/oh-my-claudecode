# Vision Pattern — Data Pipeline

> Scheduled / event-triggered batch or streaming pipeline that moves data between systems with auditable correctness.

## Structural signature
- Source → transform → sink. Each stage is idempotent, restartable, and observable.
- Driven by a scheduler (Airflow / Prefect / Dagster / cron) or a stream (Kafka / Kinesis).
- Failure is the default; partial success + retries + dead-letter queues are part of the design, not an afterthought.
- "Correctness" is measurable: row counts match, checksums agree, late-arriving data gets reprocessed.

## Canonical layout
1. **Source connector** — extract from DB / API / S3 / queue with pagination, checkpoint, rate-limit.
2. **Raw landing zone** — immutable, partitioned by ingest-date, never mutated after write.
3. **Transform stage** — dbt / SQL models / Spark job; idempotent; deterministic given the same input.
4. **Curated / marts zone** — business-ready tables, strongly typed, documented.
5. **Sink / serving** — warehouse table / API cache / downstream system; last-write-wins or versioned.
6. **Orchestrator DAG** — one file defining dependencies, retries, SLA, alerting.
7. **Data quality gates** — row count, null rate, referential integrity, freshness; hard-fail vs soft-warn per check.
8. **Dead-letter queue** — bad rows land somewhere inspectable, not `/dev/null`.
9. **Backfill runbook** — documented procedure for replaying a date range without double-counting.

## Default tech stack (suggestion, not mandate)
- Orchestration: Airflow / Prefect / Dagster (workflow) or Flink / Spark Streaming (continuous)
- Transform: dbt (SQL-first) or Spark / Polars (dataframe-first)
- Storage: S3 + Parquet / Iceberg / Delta Lake; BigQuery / Snowflake / Redshift for warehouse
- Queueing: Kafka / Kinesis / Pub/Sub for streaming
- Observability: OpenLineage + Marquez / Datahub; Great Expectations / Soda for DQ
- Secrets: Vault / AWS Secrets Manager; never in DAG code

## Non-goals
- Low-latency online serving. If reads are sub-100ms, this is a different pattern (API backend).
- Mutating source systems. Pipelines read, transform, and write downstream — they don't reach back.
- UI / dashboards. Metabase / Superset / Looker are consumers, not part of this pattern.
- Ad-hoc notebooks in production. Notebooks are exploration; pipelines are code-reviewed scheduled jobs.

## Persona focus (RRI)
- **End User** (analyst / data consumer): is the curated table documented, fresh, and typed? Can I trust `last_updated_at`?
- **Business Analyst**: are metric definitions reproducible across quarters? Does a rerun produce the same numbers?
- **QA Destroyer**: what happens on duplicate messages, on late-arriving data beyond the watermark, on schema drift upstream, on a 10x volume spike, on DST / timezone edges?
- **Developer**: is the DAG unit-testable? Can I run one task locally without the full orchestrator?
- **DevOps / Operator**: SLA + pager rules; backfill without double-counting; secret rotation without downtime.

## Flow Physics (RRI-UX) priorities (for the operator UX)
- TIME TO ACTION: operator can kick a backfill from one command / one button
- DECISION LOAD: alert tells the operator **which** task, **why**, and **what to do** in one screen
- RETURN: a failed DAG run is trivially retryable; partial success doesn't silently swallow the rest
- TASK SWITCH: DAG code + runbook + lineage + logs are reachable from the same alert

## Correctness gates (must pass in VERIFY)
- **Idempotency**: running the same task twice on the same input produces the same output (no duplicates downstream).
- **Schema contract**: upstream schema change triggers a loud failure, not a silent cast/drop.
- **Referential integrity**: foreign keys resolve; orphans land in the DLQ, not the mart.
- **Freshness SLA**: `max(updated_at) > now() - SLA` for every mart-level table.
- **Row-count sanity**: `|rows_out - expected|` within tolerance; deviations page a human.
- **PII handling**: classified columns are masked / tokenised before leaving the raw zone (where applicable).

## Acceptance skeleton
```
Given an upstream source publishes events with at-least-once semantics
When the pipeline processes a day of data
Then every curated row has a deterministic primary key (dedup safe)
And re-running the same day produces byte-identical output (idempotent)
And a 10% volume spike completes within the SLA with no manual intervention
And a schema drift upstream fails loudly with a single actionable alert
And a late-arriving event within the watermark updates the mart; beyond the watermark it lands in the DLQ with a replay recipe
```
