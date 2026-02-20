<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { useClipboard } from '@vueuse/core'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import ProseStreamPre from '../../components/prose/PreStream.vue'
import ProseA from '../../components/prose/ProseA.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent,
  a: ProseA as unknown as DefineComponent
}

/**
 * Transforms GFM-style alert blockquotes into native Nuxt UI MDC containers.
 *
 * Converts patterns like:
 *   > [!WARNING]           !WARNING Content       !WARNING
 *   > Content              [!WARNING] Content      Next-line content
 *
 * Into native MDC containers (::note, ::tip, ::warning, ::caution)
 * or ::callout{color="primary"} for IMPORTANT type.
 */

const CALLOUT_TYPES = 'NOTE|TIP|WARNING|CAUTION|IMPORTANT'
const CALLOUT_RE_BRACKET = `(?:\\*\\*)?\\[!(${CALLOUT_TYPES})\\](?:\\*\\*)?`
const CALLOUT_RE_BARE = `(?:\\*\\*)?!(${CALLOUT_TYPES})(?:\\*\\*)?`
const CALLOUT_TYPE_RE = `(?:${CALLOUT_RE_BRACKET}|${CALLOUT_RE_BARE})`

const TYPE_TO_MDC: Record<string, string> = {
  note: 'note',
  tip: 'tip',
  warning: 'warning',
  caution: 'caution',
  important: 'callout{color="primary" icon="i-lucide-message-circle-warning"}'
}

function mdcTag(type: string): string {
  return TYPE_TO_MDC[type] || 'callout{color="neutral"}'
}

function transformCallouts(md: string): string {
  let result = md.replace(/\r\n/g, '\n')

  // Pass 1: blockquote-prefixed alerts — > [!TYPE] or > !TYPE (with optional indentation/bold)
  result = result.replace(
    new RegExp(`^[ \\t]*> *${CALLOUT_TYPE_RE}[ \\t]*(.*)\\n?((?:^[ \\t]*>.*\\n?)*)`, 'gim'),
    (_match, b, bare, firstLine, rest) => {
      const type = (b || bare).toLowerCase()
      const body = collectBody(firstLine, rest, /^[ \t]*>\s?/)
      return `\n::${mdcTag(type)}\n${body}\n::\n`
    }
  )

  // Pass 2: bare alerts with content on the same line (with optional indentation)
  result = result.replace(
    new RegExp(`^[ \\t]*${CALLOUT_TYPE_RE}[ \\t]+(.+)`, 'gim'),
    (_match, b, bare, content) => {
      const type = (b || bare).toLowerCase()
      const body = content.trim()
      return `\n::${mdcTag(type)}\n${body}\n::\n`
    }
  )

  // Pass 3: bare alerts on their own line, content follows on the next line
  result = result.replace(
    new RegExp(`^[ \\t]*${CALLOUT_TYPE_RE}[ \\t]*\\n(.+)`, 'gim'),
    (_match, b, bare, content) => {
      const type = (b || bare).toLowerCase()
      const body = content.trim()
      return `\n::${mdcTag(type)}\n${body}\n::\n`
    }
  )

  return result
}

function collectBody(firstLine: string | undefined, rest: string | undefined, stripRe: RegExp): string {
  const lines: string[] = []
  const trimmed = firstLine?.trim()
  if (trimmed) lines.push(trimmed)
  if (rest) {
    for (const line of rest.split('\n')) {
      const stripped = line.replace(stripRe, '')
      if (stripped || line.startsWith('>')) lines.push(stripped)
    }
  }
  return lines.join('\n').trimEnd()
}

const route = useRoute()
const toast = useToast()
const clipboard = useClipboard()
const { quota, fetchQuota, updateFromStreamData } = useQuota()

const { data, refresh: refreshChat } = await useFetch(`/api/chats/${route.params.id}`, {
  key: `chat-${route.params.id}`
})
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
}

const pageTitle = computed(() => data.value?.title || 'New Chat')
useHead({ title: pageTitle })

const input = ref('')

const chat = new Chat({
  id: data.value.id,
  messages: data.value.messages,
  transport: new DefaultChatTransport({
    api: `/api/chats/${data.value.id}`
  }),
  onData: (dataPart) => {
    if (dataPart.type === 'data-chat-title') {
      refreshNuxtData('chats')
      refreshChat()
    }
    if (dataPart.type === 'data-quota') {
      updateFromStreamData(dataPart.data)
    }
  },
  onError(error) {
    const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  }
})

async function handleSubmit(e: Event) {
  e.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({
      text: input.value
    })
    input.value = ''
  }
}

const copied = ref(false)

function copy(e: MouseEvent, message: UIMessage) {
  clipboard.copy(getTextFromMessage(message))

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}

onMounted(() => {
  fetchQuota()
  if (data.value?.messages.length === 1) {
    chat.regenerate()
  }
})
</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar :title="pageTitle" />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
        <UChatMessages
          should-auto-scroll
          :messages="chat.messages"
          :status="chat.status"
          :assistant="chat.status !== 'streaming' ? { actions: [{ label: 'Copy', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] } : { actions: [] }"
          :spacing-offset="160"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
        >
          <template #actions="{ message }">
            <UTooltip v-if="message.role === 'assistant' && chat.status !== 'streaming'" text="Copy">
              <UButton
                size="sm"
                color="neutral"
                variant="ghost"
                :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                aria-label="Copy message"
                @click="copy($event, message)"
              />
            </UTooltip>
          </template>

          <template #content="{ message }">
            <div
              class="chat-message-enter"
              :class="{ 'streaming-content': message.role === 'assistant' && chat.status === 'streaming' && message === chat.messages[chat.messages.length - 1] }"
            >
              <template v-for="(part, index) in message.parts" :key="`${message.id}-${index}`">
                <Reasoning
                  v-if="part.type === 'reasoning'"
                  :text="part.text"
                  :is-streaming="part.state !== 'done'"
                />
                <!-- Only render markdown for assistant messages to prevent XSS from user input -->
                <MDCCached
                  v-else-if="part.type === 'text' && message.role === 'assistant'"
                  :value="transformCallouts(part.text)"
                  :cache-key="`${message.id}-${index}`"
                  :components="components"
                  :parser-options="{ highlight: false }"
                  class="*:first:mt-0 *:last:mb-0"
                />
                <!-- User messages are rendered as plain text (safely escaped by Vue) -->
                <p v-else-if="part.type === 'text' && message.role === 'user'" class="whitespace-pre-wrap">
                  {{ part.text }}
                </p>
              </template>
            </div>
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="subtle"
          placeholder="Ask a follow-up or describe another task..."
          :maxrows="8"
          class="sticky bottom-0 [view-transition-name:chat-prompt] rounded-b-none z-10"
          :ui="{ base: 'px-1.5' }"
          @submit="handleSubmit"
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
              <template v-if="quota">
                <span class="text-muted/50">&middot;</span>
                <QuotaPanel :quota="quota" />
              </template>
              <template v-if="chat.status === 'streaming'">
                <span class="text-dimmed/40">·</span>
                <span class="inline-flex items-center gap-1 text-xs text-primary">
                  <UIcon name="i-lucide-loader" class="size-3.5 animate-spin" />
                  <span>Generating...</span>
                </span>
              </template>
            </div>

            <UChatPromptSubmit
              :status="chat.status"
              color="neutral"
              size="sm"
              @stop="chat.stop()"
              @reload="chat.regenerate()"
            />
          </template>
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
