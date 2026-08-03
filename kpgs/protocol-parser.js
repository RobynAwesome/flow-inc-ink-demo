const BRACKET_TYPES = [
  { key: 'hierarchy', open: '[', close: ']', pattern: /\[([^\[\]]+)\]/g },
  { key: 'activeState', open: '{', close: '}', pattern: /\{([^{}]+)\}/g },
  { key: 'narrative', open: '<', close: '>', pattern: /<([^<>]+)>/g },
  { key: 'interpretation', open: '(', close: ')', pattern: /\(([^()]+)\)/g }
];

const CORE_EMOJI_ROUTES = Object.freeze({
  '🎓': 'KPGS',
  '🔬': 'KC',
  '🚨': 'CrisisConnect',
  '🥶': 'EP',
  '☄️': 'BP',
  '☄': 'BP',
  '👥': 'SWFUS',
  '🧊': 'BMP',
  '💜': 'care-aesthetic',
  '✝️': 'faith-aesthetic',
  '✝': 'faith-aesthetic',
  '🪻': 'project-jennifer-aesthetic'
});

function collectMatches(text, pattern, mapMatch) {
  const matches = [];
  let match;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(text)) !== null) {
    matches.push(mapMatch(match));
  }
  return matches;
}

export function parsePromptingProtocol(text = '') {
  const pattern = /#PP(?:\(([^)]+)\))?\s*(\d+)?\s*:?/gi;
  return collectMatches(text, pattern, match => ({
    raw: match[0],
    label: match[1]?.trim() || null,
    sequence: match[2] ? Number(match[2]) : null,
    index: match.index
  }));
}

export function parseBracketProtocol(text = '') {
  return BRACKET_TYPES.flatMap(type =>
    collectMatches(text, type.pattern, match => ({
      type: type.key,
      raw: match[0],
      value: match[1].trim(),
      index: match.index
    }))
  ).sort((a, b) => a.index - b.index);
}

export function parseEmojiProtocol(text = '') {
  const candidates = collectMatches(
    text,
    /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*|✝️?/gu,
    match => ({ raw: match[0], index: match.index })
  );

  return candidates.map(candidate => ({
    ...candidate,
    route: CORE_EMOJI_ROUTES[candidate.raw] || 'unmapped-symbolic-route'
  }));
}

export function inferEnglishIntent(text = '') {
  const normalized = text.toLowerCase();
  const rules = [
    ['safety-report', /unsafe|unsanitary|infection|contamination|intoxicated|alcohol|drugs?/],
    ['booking', /book|appointment|tattoo|piercing|consultation/],
    ['education', /learn|history|aftercare|educat|blog|guide|explain/],
    ['navigation', /page|open|click|services|about|contact|events?|tour/],
    ['governance', /consent|compliance|policy|governance|validate|proof|foc|poc/],
    ['collaboration', /collaborat|finance|sponsor|partner|event management|media/]
  ];

  const matches = rules.filter(([, pattern]) => pattern.test(normalized)).map(([intent]) => intent);
  return matches.length ? matches : ['general-engagement'];
}

export function parseKopanoContext(text = '') {
  const prompting = parsePromptingProtocol(text);
  const brackets = parseBracketProtocol(text);
  const emoji = parseEmojiProtocol(text);
  const englishIntent = inferEnglishIntent(text);

  return {
    rawLength: text.length,
    prompting,
    brackets,
    emoji,
    englishIntent,
    protocolDensity: Number(
      ((prompting.length + brackets.length + emoji.length) / Math.max(text.split(/\s+/).length, 1)).toFixed(3)
    )
  };
}

export { CORE_EMOJI_ROUTES };
