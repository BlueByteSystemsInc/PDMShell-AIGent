<script setup lang="ts">
// No title set — falls through to titleTemplate default: "PDMShell Assistant"

const toast = useToast()
const input = ref('')
const loading = ref(false)
const loadingPrompt = ref<string | null>(null)

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true
  loadingPrompt.value = prompt

  try {
    const parts: Array<{ type: string, text?: string, mediaType?: string, url?: string }> = [{ type: 'text', text: prompt }]

    const chat = await $fetch('/api/chats', {
      method: 'POST',
      body: {
        message: {
          role: 'user',
          parts
        }
      }
    })

    refreshNuxtData('chats')

    // Defer navigation so the view transition starts smoothly
    await nextTick()
    navigateTo(`/chat/${chat?.id}`)
  } catch {
    toast.add({
      title: 'Failed to create chat',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
    loadingPrompt.value = null
  }
}

async function onSubmit() {
  if (!input.value.trim()) return
  await createChat(input.value)
}

const quickChats = [
  {
    label: 'Export all SLDPRT files to PDF',
    icon: 'i-lucide-file-output'
  },
  {
    label: 'Check out and rename files in a folder',
    icon: 'i-lucide-file-edit'
  },
  {
    label: 'Search files by variable value',
    icon: 'i-lucide-search'
  },
  {
    label: 'Set variable on multiple files',
    icon: 'i-lucide-variable'
  },
  {
    label: 'Batch check in with comments',
    icon: 'i-lucide-upload'
  },
  {
    label: 'Extract BOM from an assembly',
    icon: 'i-lucide-list-tree'
  }
]
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
        <div>
          <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
            PDMShell Assistant
          </h1>
          <p class="text-base sm:text-lg text-muted mt-1">
            Convert natural language into PDMShell scripts for SOLIDWORKS PDM automation.
          </p>
        </div>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          placeholder="Describe your PDMShell task..."
          :maxrows="8"
          :ui="{ base: 'px-1.5', trailing: '!items-center' }"
          @submit="onSubmit"
        >
          <template #trailing>
            <UChatPromptSubmit
              :status="loading ? 'streaming' : 'ready'"
              color="neutral"
              size="sm"
            />
          </template>
        </UChatPrompt>

        <div class="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            :loading="loadingPrompt === quickChat.label"
            :disabled="loading"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full shrink-0"
            @click="createChat(quickChat.label)"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
