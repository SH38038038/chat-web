/** 전송 전 임시 메시지 ID (서버가 중복 제거에 사용하는 clientMessageId) */
export function newClientMessageId() {
  return crypto.randomUUID()
}
