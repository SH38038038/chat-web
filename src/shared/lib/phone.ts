/**
 * 한국 휴대폰 번호를 E.164(+8210...) 형식으로 변환. 휴대폰 번호가 아니면 null.
 * 010-1234-5678, 01012345678, +82 10-1234-5678 등 → +821012345678
 */
export function toKrE164(input: string): string | null {
  const digits = input.replace(/\D/g, '')
  const national = (digits.startsWith('82') ? digits.slice(2) : digits).replace(/^0/, '')
  return /^1[016789]\d{7,8}$/.test(national) ? `+82${national}` : null
}
