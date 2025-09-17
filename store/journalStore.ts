import { JournalEntry, supabase } from "@/lib/supabase"
import { create } from "zustand"

type JournalState = {
  entries: JournalEntry[]
  loading: boolean
  loaded: boolean
  fetchEntries: (userId: string) => Promise<void>
  addEntry: (entry: JournalEntry) => void
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  loading: false,
  loaded: false,

  fetchEntries: async (userId: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      set({ entries: data || [] })
    } catch (err) {
      console.error("Failed to fetch entries:", err)
    } finally {
      set({ loading: false, loaded: true })
    }
  },

  addEntry: (entry) => {
    set({ entries: [entry, ...get().entries] })
  },
}))
