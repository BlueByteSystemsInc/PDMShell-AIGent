<script setup lang="ts">
import { ShikiCachedRenderer } from 'shiki-stream/vue'
import { useClipboard } from '@vueuse/core'

const colorMode = useColorMode()
const highlighter = await useHighlighter()
const clipboard = useClipboard()

const props = defineProps<{
  code: string
  language: string
  class?: string
  meta?: string
}>()

const trimmedCode = computed(() => {
  return props.code.trim().replace(/`+$/, '')
})
const lang = computed(() => {
  switch (props.language) {
    case 'vue':
      return 'vue'
    case 'javascript':
      return 'js'
    case 'typescript':
      return 'ts'
    case 'css':
      return 'css'
    default:
      return props.language
  }
})
const key = computed(() => {
  return `${lang.value}-${colorMode.value}`
})

const copied = ref(false)

function copyCode() {
  clipboard.copy(trimmedCode.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="group/code relative">
    <button
      class="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md px-1.5 py-1 text-xs opacity-0 transition-opacity group-hover/code:opacity-100 bg-default/80 backdrop-blur text-muted hover:text-highlighted border border-default/50"
      :aria-label="copied ? 'Copied!' : 'Copy code'"
      @click="copyCode"
    >
      <UIcon :name="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'" class="size-3.5" />
      <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
    </button>

    <ProsePre v-bind="props" :ui="{ copy: 'hidden' }">
      <ShikiCachedRenderer
        :key="key"
        :highlighter="highlighter"
        :code="trimmedCode"
        :lang="lang"
        :theme="colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter'"
      />
    </ProsePre>
  </div>
</template>
