import { defineStore } from 'pinia'
import { useToast } from '~/composables/useToast'

interface SavedContent {
  content: string
  timestamp: string
  branch: string
  filePath: string
}

interface EditorState {
  savedContents: Record<string, SavedContent[]>  // key is filePath-branch
  currentBranch: string
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => {
    const savedState = localStorage.getItem('editor-saves')
    return {
      savedContents: savedState ? JSON.parse(savedState) : {},
      currentBranch: 'main'
    }
  },

  getters: {
    getSavedContents: (state) => (filePath: string) => {
      const key = `${filePath}-${state.currentBranch}`
      return state.savedContents[key] || []
    },
  },

  actions: {
    saveContent(filePath: string, content: string) {
      const { showToast } = useToast()
      const key = `${filePath}-${this.currentBranch}`
      const newSave = {
        content,
        timestamp: new Date().toISOString(),
        branch: this.currentBranch,
        filePath
      }

      if (!this.savedContents[key]) {
        this.savedContents[key] = []
      }
      this.savedContents[key].push(newSave)

      // Persist to localStorage
      localStorage.setItem('editor-saves', JSON.stringify(this.savedContents))

      // Show success toast
      showToast({
        title: 'Changes Saved',
        description: `Changes saved locally on branch "${this.currentBranch}"`,
      })
    },

    loadSaves() {
      const saved = localStorage.getItem('editor-saves')
      if (saved) {
        this.savedContents = JSON.parse(saved)
      }
    },

    setBranch(branch: string) {
      this.currentBranch = branch
      // When branch changes, we want to persist the current state
      localStorage.setItem('editor-saves', JSON.stringify(this.savedContents))
    },

    clearSaves(filePath: string) {
      const { showToast } = useToast()
      const key = `${filePath}-${this.currentBranch}`
      if (this.savedContents[key]) {
        delete this.savedContents[key]
        localStorage.setItem('editor-saves', JSON.stringify(this.savedContents))
        
        showToast({
          title: 'Saves Cleared',
          description: `All local saves cleared for "${filePath}" on branch "${this.currentBranch}"`,
        })
      }
    },

    deleteSave(filePath: string, timestamp: string) {
      const { showToast } = useToast()
      const key = `${filePath}-${this.currentBranch}`
      if (this.savedContents[key]) {
        this.savedContents[key] = this.savedContents[key].filter(
          save => save.timestamp !== timestamp
        )
        localStorage.setItem('editor-saves', JSON.stringify(this.savedContents))

        showToast({
          title: 'Save Deleted',
          description: `Local save deleted from branch "${this.currentBranch}"`,
        })
      }
    }
  }
})
