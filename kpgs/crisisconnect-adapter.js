export class CrisisConnectAdapter {
  constructor(options = {}) {
    this.endpoint = options.endpoint || null;
    this.apiKey = options.apiKey || null;
    this.enabled = Boolean(options.enabled && this.endpoint);
  }

  async submit(envelope, options = {}) {
    if (!this.enabled) {
      return {
        ok: false,
        state: 'POC-local-only',
        reason: 'No verified CrisisConnect ingestion endpoint is configured.'
      };
    }

    if (!options.consent) {
      return {
        ok: false,
        state: 'blocked-by-governance',
        reason: 'Explicit consent is required before transmission.'
      };
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify(envelope)
    });

    return {
      ok: response.ok,
      state: response.ok ? 'submitted' : 'rejected',
      status: response.status,
      requestId: response.headers.get('x-request-id')
    };
  }
}
