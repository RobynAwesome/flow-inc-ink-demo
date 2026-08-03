import { parseKopanoContext } from './protocol-parser.js';

const STORAGE_KEY = 'flow-inc:kpgs:hue-events:v1';
const MAX_LOCAL_EVENTS = 100;

function randomId(prefix = 'evt') {
  if (globalThis.crypto?.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function redactPII(value = '') {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email-redacted]')
    .replace(/(?:\+?27|0)[\s-]?(?:\d[\s-]?){9}/g, '[phone-redacted]');
}

function depthScore(text, parsed, context) {
  let score = 0;
  if (text.length > 40) score += 1;
  if (text.length > 180) score += 1;
  if (parsed.prompting.length) score += 1;
  if (parsed.brackets.length >= 2) score += 1;
  if (parsed.emoji.length) score += 1;
  if (Object.keys(context || {}).length >= 2) score += 1;
  return Math.min(score, 5);
}

function evidenceStatus(claims = [], evidence = []) {
  const normalizedEvidence = new Set(evidence.map(item => item.claimId).filter(Boolean));
  return claims.map(claim => ({
    ...claim,
    proofState: normalizedEvidence.has(claim.id) ? 'POC-supported' : 'FOC-risk-unverified'
  }));
}

function buildVectors({ parsed, context, eventType }) {
  return {
    reality: {
      label: 'human-lived / street-reality',
      evidence: context.location || context.media || context.humanState
        ? [context.location, context.media, context.humanState].filter(Boolean)
        : [],
      state: context.location || context.media || context.humanState ? 'observed' : 'not-observed'
    },
    runtime: {
      label: 'cloud / device / session-runtime',
      evidence: [context.page, context.referrer, context.device, context.sessionId].filter(Boolean),
      state: context.page || context.sessionId ? 'observed' : 'partial'
    },
    governance: {
      label: 'report / consent / action-governance',
      evidence: [eventType, context.consent ? 'consent-granted' : null, ...parsed.englishIntent].filter(Boolean),
      state: context.consent ? 'actionable' : 'local-only'
    }
  };
}

export class HUEEngine {
  constructor(options = {}) {
    this.app = options.app || 'flow-inc-ink-demo';
    this.version = options.version || '0.1.0-poc';
    this.persist = options.persist !== false;
  }

  interpret(input, options = {}) {
    const text = String(input || '').trim();
    const context = options.context || {};
    const eventType = options.eventType || 'human-intent';
    const parsed = parseKopanoContext(text);
    const claims = evidenceStatus(options.claims || [], options.evidence || []);

    const envelope = {
      kpcbVersion: 'KPCB+ POC/0.1',
      eventId: randomId('hue'),
      createdAt: new Date().toISOString(),
      app: this.app,
      engine: { name: 'HUE Engine', version: this.version },
      eventType,
      kopanoContext: {
        input: options.retainRaw === true ? redactPII(text) : undefined,
        inputHashCandidate: `${text.length}:${parsed.protocolDensity}`,
        protocols: parsed,
        depth: depthScore(text, parsed, context)
      },
      vectors: buildVectors({ parsed, context, eventType }),
      intent: {
        primary: parsed.englishIntent[0],
        candidates: parsed.englishIntent,
        confidence: parsed.englishIntent[0] === 'general-engagement' ? 0.35 : 0.72
      },
      governance: {
        consent: Boolean(context.consent),
        persistence: this.persist && Boolean(context.consent) ? 'local-consented' : 'ephemeral',
        piiPolicy: 'redact-by-default',
        claims,
        focRiskCount: claims.filter(claim => claim.proofState === 'FOC-risk-unverified').length
      }
    };

    if (this.persist && context.consent) this.persistLocal(envelope);
    return envelope;
  }

  persistLocal(envelope) {
    try {
      const queue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      queue.push(envelope);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.slice(-MAX_LOCAL_EVENTS)));
      return true;
    } catch {
      return false;
    }
  }

  readLocal() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  clearLocal() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }
}

export { redactPII };
