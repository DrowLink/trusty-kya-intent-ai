'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Copy, 
  Check, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

type DocSection = 'protocol' | 'mandates_api' | 'decision_api' | 'scanner_api' | 'security' | 'rails';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<DocSection>('protocol');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <main id="content" className="docs-page">
      <header className="docs-header">
        <h1>Developer Documentation & Protocol Specs</h1>
        <p>
          Architectural reference, KYA (Know Your Agent) specifications, and REST API documentation for autonomous intent authorization.
        </p>
      </header>

      <div className="docs-layout">
        {/* Sidebar Navigation */}
        <aside className="docs-sidebar">
          <button 
            type="button" 
            className={`docs-nav-btn ${activeSection === 'protocol' ? 'active' : ''}`}
            onClick={() => setActiveSection('protocol')}
          >
            <Layers size={16} />
            <span>Protocol Lifecycle</span>
          </button>
          <button 
            type="button" 
            className={`docs-nav-btn ${activeSection === 'mandates_api' ? 'active' : ''}`}
            onClick={() => setActiveSection('mandates_api')}
          >
            <FileText size={16} />
            <span>Mandates API</span>
          </button>
          <button 
            type="button" 
            className={`docs-nav-btn ${activeSection === 'decision_api' ? 'active' : ''}`}
            onClick={() => setActiveSection('decision_api')}
          >
            <Terminal size={16} />
            <span>Decision Clearing</span>
          </button>
          <button 
            type="button" 
            className={`docs-nav-btn ${activeSection === 'scanner_api' ? 'active' : ''}`}
            onClick={() => setActiveSection('scanner_api')}
          >
            <Cpu size={16} />
            <span>AST Code Scanner</span>
          </button>
          <button 
            type="button" 
            className={`docs-nav-btn ${activeSection === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSection('security')}
          >
            <ShieldCheck size={16} />
            <span>KYA & Circuit Breakers</span>
          </button>
          <button 
            type="button" 
            className={`docs-nav-btn ${activeSection === 'rails' ? 'active' : ''}`}
            onClick={() => setActiveSection('rails')}
          >
            <Lock size={16} />
            <span>Provider Rail Interceptors</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="docs-content">
          {/* SECTION: PROTOCOL OVERVIEW */}
          {activeSection === 'protocol' && (
            <div className="docs-card">
              <h2>The Intent Authorization Lifecycle</h2>
              <p>
                Autonomous economic agents operating corporate payment rails require deterministic boundaries. Traditional financial controls check whether a corporate card has sufficient credit limit; TRUSTY verifies whether the proposed purchase matches the human instruction before the transaction is executed.
              </p>

              <h3>The 5-Stage Verification Sequence</h3>
              <ol>
                <li>
                  <strong>Mandate Formulation & Cryptographic Hash:</strong> The human principal issues a procurement instruction (e.g. &ldquo;Buy 20 laptops, min 16GB RAM, max $20,000 for Miami HQ&rdquo;). TRUSTY produces a structured mandate and signs a SHA-256 digest: <code>H(Mandate)</code>.
                </li>
                <li>
                  <strong>Action Proposal & Cart Evidence Capture:</strong> The AI purchasing agent compiles a cart and submits itemized SKU evidence, vendor credentials, pricing, and destination details.
                </li>
                <li>
                  <strong>Deterministic Intent Evaluation:</strong> TRUSTY cross-references every criterion with a strict <code>MATCH | MISMATCH | UNKNOWN</code> result. Price checks alone do not satisfy the check: staying under budget with incorrect quantities or specifications is immediately flagged.
                </li>
                <li>
                  <strong>Human-in-the-Loop Exception Routing:</strong> Discrepancies or unverified vendors are pushed to the corporate review queue. Finance leads can inspect the deviation, approve an explicit one-time exception, or reject the purchase.
                </li>
                <li>
                  <strong>Cryptographic Decision Binding & Settlement:</strong> Approvals are bound to <code>H(Mandate) || H(Cart)</code>. Corporate payment cards (Brex, Ramp, Slash) execute the checkout, and TRUSTY records an immutable audit trail for accounting reconciliation.
                </li>
              </ol>

              <div style={{ marginTop: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link href="/demo" className="marketing-button small">
                  Test Live Demo Scenario <ArrowRight size={14} />
                </Link>
                <Link href="/app" className="text-link">
                  Open Operating Console
                </Link>
              </div>
            </div>
          )}

          {/* SECTION: MANDATES API */}
          {activeSection === 'mandates_api' && (
            <div className="docs-card">
              <div className="endpoint-header">
                <span className="method-badge post">POST</span>
                <span className="endpoint-path">/api/v1/mandates</span>
              </div>
              <h2>Create Verified Human Mandate</h2>
              <p>
                Registers an authenticated corporate purchasing mandate. The mandate establishes the legal ceiling and technical specifications an AI agent must adhere to.
              </p>

              <h3>Request Body</h3>
              <table className="param-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>title</code></td>
                    <td>string <span className="tag-required">required</span></td>
                    <td>Human-readable label for the procurement mandate.</td>
                  </tr>
                  <tr>
                    <td><code>principalName</code></td>
                    <td>string <span className="tag-required">required</span></td>
                    <td>Name or identity of the authorizing manager.</td>
                  </tr>
                  <tr>
                    <td><code>scope.itemTypes</code></td>
                    <td>string[] <span className="tag-required">required</span></td>
                    <td>Permitted hardware categories (e.g. <code>[&quot;Laptop&quot;, &quot;Workstation&quot;]</code>).</td>
                  </tr>
                  <tr>
                    <td><code>constraints.maxTotalBudget</code></td>
                    <td>number <span className="tag-required">required</span></td>
                    <td>Absolute spend ceiling in USD.</td>
                  </tr>
                  <tr>
                    <td><code>constraints.maxUnitCount</code></td>
                    <td>number <span className="tag-required">required</span></td>
                    <td>Authorized quantity of items. Extra units trigger an automatic review.</td>
                  </tr>
                </tbody>
              </table>

              <h3>Example cURL</h3>
              <div className="code-container">
                <div className="code-top">
                  <span>cURL</span>
                  <button 
                    type="button"
                    onClick={() => copyToClipboard(`curl -X POST https://trusty-kya-intent-ai.vercel.app/api/v1/mandates \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Engineering Workstations",
    "principalName": "Alex Chen",
    "scope": {
      "itemTypes": ["Laptop"],
      "specifications": { "minRamGb": 16 },
      "shippingDestination": "Miami Office"
    },
    "constraints": {
      "maxTotalBudget": 20000,
      "maxUnitCount": 20
    }
  }'`, 'mandates_curl')}
                  >
                    {copiedKey === 'mandates_curl' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedKey === 'mandates_curl' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="code-pre">
{`curl -X POST https://trusty-kya-intent-ai.vercel.app/api/v1/mandates \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Engineering Workstations",
    "principalName": "Alex Chen",
    "scope": {
      "itemTypes": ["Laptop"],
      "specifications": { "minRamGb": 16 },
      "shippingDestination": "Miami Office"
    },
    "constraints": {
      "maxTotalBudget": 20000,
      "maxUnitCount": 20
    }
  }'`}
                </pre>
              </div>
            </div>
          )}

          {/* SECTION: DECISION API */}
          {activeSection === 'decision_api' && (
            <div className="docs-card">
              <div className="endpoint-header">
                <span className="method-badge post">POST</span>
                <span className="endpoint-path">/api/decision</span>
              </div>
              <h2>Real-Time Decision Clearing Gateway</h2>
              <p>
                Machine-to-Machine clearing gateway evaluated directly before corporate card checkout. The engine compares the itemized cart against the signed mandate.
              </p>

              <h3>Evaluation Response Schema</h3>
              <div className="code-container">
                <div className="code-top">
                  <span>JSON Response (200 OK)</span>
                  <button 
                    type="button"
                    onClick={() => copyToClipboard(`{
  "success": true,
  "decision": "APPROVED",
  "evaluation": {
    "mandateMatch": true,
    "criteriaResults": [
      { "criterion": "Quantity", "status": "MATCH", "evidence": "20 units" },
      { "criterion": "RAM", "status": "MATCH", "evidence": "16 GB unified" },
      { "criterion": "Delivery", "status": "MATCH", "evidence": "Miami Office" },
      { "criterion": "Budget", "status": "MATCH", "evidence": "$18,400 <= $20,000" }
    ],
    "cryptographicProof": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
  }
}`, 'decision_res')}
                  >
                    {copiedKey === 'decision_res' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedKey === 'decision_res' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="code-pre">
{`{
  "success": true,
  "decision": "APPROVED",
  "evaluation": {
    "mandateMatch": true,
    "criteriaResults": [
      { "criterion": "Quantity", "status": "MATCH", "evidence": "20 units" },
      { "criterion": "RAM", "status": "MATCH", "evidence": "16 GB unified" },
      { "criterion": "Delivery", "status": "MATCH", "evidence": "Miami Office" },
      { "criterion": "Budget", "status": "MATCH", "evidence": "$18,400 <= $20,000" }
    ],
    "cryptographicProof": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
  }
}`}
                </pre>
              </div>
            </div>
          )}

          {/* SECTION: SCANNER API */}
          {activeSection === 'scanner_api' && (
            <div className="docs-card">
              <div className="endpoint-header">
                <span className="method-badge post">POST</span>
                <span className="endpoint-path">/api/scan-repo</span>
              </div>
              <h2>AST Static Security Scanner</h2>
              <p>
                Performs on-demand Abstract Syntax Tree (AST) scanning of agent repositories without downloading git history. Inspects imports, shell invocation primitives, and financial SDK usage.
              </p>

              <h3>Detected AST Primitives</h3>
              <ul>
                <li><strong>Dangerous Shell Execution:</strong> <code>subprocess.Popen</code>, <code>os.system</code>, <code>eval()</code>, <code>exec()</code>.</li>
                <li><strong>Financial SDKs:</strong> <code>stripe</code>, <code>plaid</code>, <code>web3</code>, <code>boto3</code>.</li>
                <li><strong>Network Sockets:</strong> Direct TCP egress sockets and unauthenticated HTTP callers.</li>
              </ul>

              <div className="code-container">
                <div className="code-top">
                  <span>cURL</span>
                  <button 
                    type="button"
                    onClick={() => copyToClipboard(`curl -X POST https://trusty-kya-intent-ai.vercel.app/api/scan-repo \\
  -H "Content-Type: application/json" \\
  -d '{"githubUrl": "https://github.com/DrowLink/trusty-kya-intent-ai"}'`, 'scan_curl')}
                  >
                    {copiedKey === 'scan_curl' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedKey === 'scan_curl' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="code-pre">
{`curl -X POST https://trusty-kya-intent-ai.vercel.app/api/scan-repo \\
  -H "Content-Type: application/json" \\
  -d '{"githubUrl": "https://github.com/DrowLink/trusty-kya-intent-ai"}'`}
                </pre>
              </div>
            </div>
          )}

          {/* SECTION: SECURITY & CIRCUIT BREAKERS */}
          {activeSection === 'security' && (
            <div className="docs-card">
              <h2>KYA Standard & Mathematical Circuit Breakers</h2>
              <p>
                Weighted averages are dangerous when dealing with financial autonomy. If an agent has verified documentation and a high star count, but executes unsandboxed shell commands, traditional composite scoring would still produce an acceptable rating. TRUSTY implements hard mathematical circuit breakers.
              </p>

              <table className="param-table">
                <thead>
                  <tr>
                    <th>Detected Threat</th>
                    <th>Circuit Override</th>
                    <th>Resulting Tier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Malware / Exfiltration Payload</strong></td>
                    <td>Score hard-capped at <strong>0 / 100</strong></td>
                    <td><code>SUBPRIME_D</code> (Spending Blocked: $0)</td>
                  </tr>
                  <tr>
                    <td><strong>Credential Theft / Hardcoded Secrets</strong></td>
                    <td>Score hard-capped at <strong>10 / 100</strong></td>
                    <td><code>SUBPRIME_D</code> (Spending Blocked: $0)</td>
                  </tr>
                  <tr>
                    <td><strong>Unsandboxed Host Shell Commands</strong></td>
                    <td>Score hard-capped at <strong>25 / 100</strong></td>
                    <td><code>CRITICAL_RISK</code> (Mandatory Human Sign-off)</td>
                  </tr>
                  <tr>
                    <td><strong>Low Telemetry Confidence (&lt; 60%)</strong></td>
                    <td>Score bounded mathematically by <code>Score &times; (C / 0.6)</code></td>
                    <td><code>RESTRICTED_PILOT</code> (Envelopes limited to $500)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* SECTION: PROVIDER RAILS */}
          {activeSection === 'rails' && (
            <div className="docs-card">
              <h2>Financial Rail Interceptors</h2>
              <p>
                TRUSTY is designed to sit alongside corporate card providers rather than replace them. The financial provider manages funds, balances, credit underwriting, and fraud networks; TRUSTY provides the missing human intent verification.
              </p>

              <h3>Supported Target Architectures</h3>
              <ul>
                <li>
                  <strong>Brex:</strong> Virtual card issuance webhooks bound to the mandate hash before checkout approval.
                </li>
                <li>
                  <strong>Ramp:</strong> Multi-entity corporate expense policies combined with itemized receipt reconciliation.
                </li>
                <li>
                  <strong>Slash:</strong> Autonomous developer card issuance with granular velocity envelopes.
                </li>
                <li>
                  <strong>Stripe Issuing:</strong> Authorizations webhook intercepted with real-time synchronous decision clearance within 2,000ms.
                </li>
              </ul>

              <div style={{ marginTop: '20px' }}>
                <Link href="/contact" className="marketing-button small">
                  Request Design Partner Sandbox <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
