---
name: security-audit
description: >
  Cloudflare structured multi-phase security audit workflow for software repositories.
  Enforces adversarial hunting, independent verification, externalized coverage tracking,
  and client-side privacy boundary verification to ensure zero data breaches and local-only storage.
---

# Cloudflare Security Audit Skill

This skill enforces Cloudflare's structured six-phase adversarial security review framework to detect vulnerabilities, eliminate false positives, and verify strict data containment boundaries (ensuring user financial data is stored locally and not transmitted to unauthorized remote servers).

## Core Principles

1. **Adversarial Verification:** Hunter agents discover candidate vulnerabilities; fresh, independent verifier agents actively attempt to disprove them.
2. **File-Backed Externalized State:** Tracking is anchored in version-controlled JSON ledgers (`coverage-ledger.json`, `findings.json`).
3. **Strict Verdict Classification:** Every candidate finding must resolve to one of three verdicts:
   - `confirmed`: Complete, verifiable source-to-sink trace with bounded, observed security impact.
   - `needs_validation`: Unresolved factual ambiguity requiring human context; carries no severity score.
   - `rejected`: Successfully disproved during adversarial challenge.
4. **Local Data Containment Guarantee:** Verifies that sensitive application payloads (such as banking data, financial transactions, balances, and PII) reside exclusively in client-side sandboxed storage (`window.localStorage` / `IndexedDB`), without telemetry exfiltration or remote server transmission.

---

## The Six-Phase Audit Workflow

```
[Phase 1: Reconnaissance]
         │ (Architecture, Entry Points, Data Flows -> coverage-ledger.json)
         ▼
[Phase 2: Coverage-Led Hunting]
         │ (Candidate Vulnerability Discovery across code units)
         ▼
[Phase 3: Adversarial Candidate Validation]
         │ (Fresh Verifier Attempts to Disprove Findings)
         ▼
[Phase 4: Structured Output Serialization]
         │ (Compilation into findings.json with schema validation)
         ▼
[Phase 5: Independent Record Verification]
         │ (Source claims verification against current code state)
         ▼
[Phase 6: Target-Neutral Reporting]
           (Production of REPORT.md and Security Assurances)
```

### Phase 1: Reconnaissance & Trust Boundary Mapping
- Map the architecture, entry points, trust boundaries, network egress points, and storage layers.
- Initialize `security-audit/coverage-ledger.json` enumerating all codebase units.
- Document the threat model and storage boundaries in `security-audit/architecture.md`.

### Phase 2: Coverage-Led Hunting
- Systematically inspect each codebase unit identified in `coverage-ledger.json`.
- Focus areas for web/finance applications:
  - **Data Storage:** Ensure all financial states, transaction history, and account balances are strictly stored locally on the user's browser (e.g. `localStorage`), without background exfiltration.
  - **Injection & XSS:** Verify all inputs, labels, descriptions, and dynamic SVG nodes are sanitized and free from unsafe `dangerouslySetInnerHTML`, `eval`, or script execution sinks.
  - **Third-Party Egress:** Audit `fetch`, `XMLHttpRequest`, `WebSocket`, or hidden tracking scripts to ensure zero financial leakage.
  - **Component Isolation:** Ensure SVG rendering primitives (e.g. `AnalyticsBento`) maintain boundary validation without prototype pollution.

### Phase 3: Adversarial Candidate Validation
- For every potential issue flagged in Phase 2, challenge the finding:
  - Can the vulnerability actually be reached from untrusted input?
  - Does existing framework escaping (e.g. React JSX auto-escaping, Vite bundler constraints) prevent the exploit?
  - Is data transmission strictly confined to client-side memory and browser storage?

### Phase 4: Structured Output Compilation
- Format all validated findings into `security-audit/findings.json` matching `report-schema.json`.
- Run the schema validator `node security-audit/validate-findings.cjs`.

### Phase 5: Independent Record Verification
- Verify line numbers, source snippets, and claims against the live code tree.

### Phase 6: Reporting
- Generate target-neutral Markdown report `security-audit/REPORT.md`.

---

## Running the Security Audit

```bash
# Validate findings schema and coverage integrity
node security-audit/validate-findings.cjs
```
