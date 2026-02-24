<script setup lang="ts">
import { ShikiCachedRenderer } from 'shiki-stream/vue'
import { useClipboard, useTimeoutFn } from '@vueuse/core'

const colorMode = useColorMode()
const clipboard = useClipboard()

// Non-blocking highlighter: render plain code instantly, upgrade to syntax highlighting when ready
const highlighter = shallowRef<Awaited<ReturnType<typeof useHighlighter>> | null>(null)
onMounted(() => {
  useHighlighter().then((h) => {
    highlighter.value = h
  })
})

const props = defineProps<{
  code: string
  language: string
  class?: string
  meta?: string
}>()

const trimmedCode = computed(() => {
  return props.code.trim().replace(/`+$/, '')
})

const LANG_MAP: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts'
}

const lang = computed(() => {
  return LANG_MAP[props.language] || props.language
})

const key = computed(() => {
  return `${lang.value}-${colorMode.value}`
})

const copied = ref(false)
const { start: resetCopied } = useTimeoutFn(() => {
  copied.value = false
}, 2000, { immediate: false })

function copyCode() {
  clipboard.copy(trimmedCode.value)
  copied.value = true
  resetCopied()
}
</script>

<template>
  <div class="group/code relative">
    <div class="absolute right-2 top-2 z-10 flex items-center gap-1.5 opacity-0 transition-opacity group-hover/code:opacity-100 focus-within:opacity-100">
      <span v-if="lang" class="rounded-md px-1.5 py-0.5 text-xs bg-default/80 backdrop-blur text-dimmed border border-default/50 select-none">
        {{ lang }}
      </span>
      <button
        class="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs bg-default/80 backdrop-blur text-muted hover:text-highlighted border border-default/50"
        :aria-label="copied ? 'Copied!' : 'Copy code'"
        @click="copyCode"
      >
        <UIcon :name="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" class="size-3.5" />
        <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>

    <ProsePre v-bind="props" :ui="{ copy: 'hidden' }">
      <ShikiCachedRenderer
        v-if="highlighter"
        :key="key"
        :highlighter="highlighter"
        :code="trimmedCode"
        :lang="lang"
        :theme="colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter'"
      />
      <code v-else class="text-sm whitespace-pre">{{ trimmedCode }}</code>
    </ProsePre>
  </div>
</template>
