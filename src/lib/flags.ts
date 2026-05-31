export function getFlagUrl(imgCode: string | null | undefined): string | null {
  return imgCode ? `/flags/${imgCode}.svg` : null
}

// ISO 3166-1 alpha-2 → FIFA 3-letter code used on scoreboards
const FIFA_CODE: Record<string, string> = {
  AR: 'ARG',
  AT: 'AUT',
  AU: 'AUS',
  BA: 'BIH',
  BE: 'BEL',
  BR: 'BRA',
  CA: 'CAN',
  CD: 'COD',
  CH: 'SUI',
  CI: 'CIV',
  CO: 'COL',
  CV: 'CPV',
  CW: 'CUW',
  CZ: 'CZE',
  DE: 'GER',
  DZ: 'ALG',
  EC: 'ECU',
  EG: 'EGY',
  ES: 'ESP',
  FR: 'FRA',
  'GB-EN': 'ENG',
  'GB-SCT': 'SCO',
  GH: 'GHA',
  HR: 'CRO',
  HT: 'HAI',
  IQ: 'IRQ',
  IR: 'IRN',
  JO: 'JOR',
  JP: 'JPN',
  KR: 'KOR',
  MA: 'MAR',
  MX: 'MEX',
  NL: 'NED',
  NO: 'NOR',
  NZ: 'NZL',
  PA: 'PAN',
  PT: 'POR',
  PY: 'PAR',
  QA: 'QAT',
  SA: 'KSA',
  SE: 'SWE',
  SN: 'SEN',
  TN: 'TUN',
  TR: 'TUR',
  US: 'USA',
  UY: 'URU',
  UZ: 'UZB',
  ZA: 'RSA',
}

export function getCountryCode(imgCode: string | null | undefined): string | null {
  if (!imgCode) return null
  return FIFA_CODE[imgCode] ?? null
}

export function shortenTeamName(name: string): string {
  let m = name.match(/^Winner of Group ([A-Z]+)$/)
  if (m) return `1st ${m[1]}`

  m = name.match(/^Runner-up of Group ([A-Z]+)$/)
  if (m) return `2nd ${m[1]}`

  if (name.startsWith('Best 3rd')) return 'Best 3rd'

  m = name.match(/^Winner of Match (\d+)$/)
  if (m) return `W. M${m[1]}`

  m = name.match(/^Loser of Match (\d+)$/)
  if (m) return `L. M${m[1]}`

  return name
}
