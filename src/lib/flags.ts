export function getFlagUrl(imgCode: string | null | undefined): string | null {
  return imgCode ? `/flags/${imgCode}.svg` : null
}
