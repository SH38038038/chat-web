import { ChatIcon } from '@/shared/ui/icons'

export function ChatEmptyPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-chat text-sub">
      <ChatIcon size={40} strokeWidth={1.4} />
      <p>왼쪽에서 대화방을 골라 주세요.</p>
    </div>
  )
}
