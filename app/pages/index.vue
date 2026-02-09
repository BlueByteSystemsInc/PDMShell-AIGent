<script setup lang="ts">
// No title set — falls through to titleTemplate default: "PDMShell Assistant"

const input = ref('')
const loading = ref(false)
const loadingPrompt = ref<string | null>(null)
const chatId = crypto.randomUUID()

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true
  loadingPrompt.value = prompt

  const parts: Array<{ type: string, text?: string, mediaType?: string, url?: string }> = [{ type: 'text', text: prompt }]

  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: {
      id: chatId,
      message: {
        role: 'user',
        parts
      }
    }
  })

  refreshNuxtData('chats')

  // Defer navigation to next frame so the view transition starts smoothly
  requestAnimationFrame(() => {
    navigateTo(`/chat/${chat?.id}`)
  })
}

async function onSubmit() {
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
        </div>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          placeholder="Describe your PDMShell task..."
          :maxrows="8"
          :ui="{ base: 'px-1.5' }"
          @submit="onSubmit"
        >
          <template #footer>
            <div class="flex items-center gap-1.5">
              <span class="inline-flex items-center gap-1 text-xs text-muted">
                <UIcon name="i-lucide-cpu" class="size-3.5" />
                <span>Llama 3.3 70B</span>
              </span>
              <span class="text-muted/50">·</span>
              <UTooltip text="PDMShell documentation is automatically retrieved for each query">
                <span class="inline-flex items-center gap-1 text-xs text-muted hover:text-highlighted cursor-default transition-colors">
                  <UIcon name="i-lucide-book-open" class="size-3.5" />
                  <span>RAG</span>
                </span>
              </UTooltip>
            </div>

            <UChatPromptSubmit
              :status="loading ? 'streaming' : 'ready'"
              color="neutral"
              size="sm"
            />
          </template>
        </UChatPrompt>

        <div class="flex flex-wrap gap-2">
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
            class="rounded-full"
            @click="createChat(quickChat.label)"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
