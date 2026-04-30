import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="mx-2 h-4"
      />
      <h1 className="text-base font-medium">Chatbot Builder</h1>
      <div className="ml-auto flex items-center gap-2">
      </div>
    </header>
  )
}