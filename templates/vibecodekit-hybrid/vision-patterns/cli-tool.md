# Vision Pattern — CLI Tool

> Command-line program that Unix-philosophers can compose, script, and trust in pipelines.

## Structural signature
- Stateless by default; reads from flags / stdin / config, writes to stdout / files / exit code.
- Every subcommand does **one thing** and is orthogonal to the others.
- TTY is a secondary UX; pipes + scripts are the primary UX.
- Backwards compatibility is part of the contract — flag names are API.

## Canonical layout
1. **Top-level binary** — `<tool>`, exits 0 on success, non-zero on any error.
2. **Subcommands** — `<tool> <verb> [args]`. Verbs are nouns/imperative. 3-8 top-level verbs.
3. **`--help` / `-h`** — available on every command and subcommand; usage + examples + exit codes.
4. **`--version`** — machine-parseable (SemVer).
5. **`--json` / `--format`** — structured output mode for any command that prints human text.
6. **`--quiet` / `--verbose`** — log-level control; default is "human, no emoji spam".
7. **Stdin handling** — accept piped input where it makes sense (`cat foo | tool parse -`).
8. **Config** — XDG-respecting: `$XDG_CONFIG_HOME/<tool>/config` then `~/.config/<tool>/config`.
9. **Shell completion** — `<tool> completion {bash,zsh,fish}` emits completion script.

## Default tech stack (suggestion, not mandate)
- Language: Go (single static binary, cross-compile) or Rust (clap + anyhow)
- Alt: Node (oclif / commander) if the rest of the ecosystem is JS
- Testing: table-driven tests for every subcommand; golden-file tests for stdout
- Packaging: Homebrew + Scoop + apt/deb + standalone tarball
- Docs: `--help` first, man pages second, website third

## Non-goals
- GUI / webview wrapper. If needed, this is a different pattern (desktop app).
- Daemonising / running as a service. Use `systemd` / `launchd` unit files instead.
- Auto-updating in the background. Let the package manager own lifecycle.
- Emoji / ANSI colour by default in non-TTY output. Respect `NO_COLOR` and `isatty(stdout)`.

## Persona focus (RRI)
- **End User**: can I learn 80% of the tool from `<tool> --help` + 2 examples?
- **Business Analyst**: is exit code + JSON output stable enough to pipe into cron + Slack?
- **QA Destroyer**: what happens on non-UTF-8 stdin, on a 500MB piped file, on a path with spaces, on SIGINT mid-operation?
- **Developer**: is `<tool> --json` diff-stable across versions so snapshot tests don't drift?
- **DevOps / Operator**: single binary, no runtime deps, works in Alpine, works in `scratch`, works in CI without a shell.

## Flow Physics (RRI-UX) priorities
- TIME TO ACTION: first successful command completes in < 1s after install
- DECISION LOAD: top-level help fits in one screen (80×24); no more than 8 verbs
- RETURN: errors print a single actionable sentence + exit code — not a stack trace by default
- TASK SWITCH: interrupt-safe (ctrl-c leaves no half-written files; use atomic writes)
- VIEWPORT: colour / emoji / spinners only when `isatty` and `NO_COLOR` is unset

## Acceptance skeleton
```
Given a user installs the tool via their package manager
When they run `<tool> --help`
Then they see top-level verbs, a one-line purpose, and 1-2 real examples within 24 lines

Given a CI pipeline pipes JSON into `<tool> <verb> -`
When the process completes
Then exit code is 0 on success, non-zero on any error, JSON on stdout is parseable
And no ANSI escape codes appear in non-TTY output
And stderr is reserved for diagnostics, stdout for structured data
```
