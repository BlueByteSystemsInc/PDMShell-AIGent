<script setup lang="ts">
const props = defineProps<{
  text: string
  isStreaming?: boolean
}>()

const open = computed(() => props.isStreaming ?? false)
const openModel = ref(open.value)

watch(open, (v) => {
  openModel.value = v
})

const STRIP_MD_RE = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|^#+\s+/gm

const lines = computed(() => {
  return props.text
    .replace(STRIP_MD_RE, (_, bold, italic, code) => bold || italic || code || '')
    .split('\n')
    .filter(Boolean)
})
</script>

<template>
  <UCollapsible v-model:open="openModel" class="flex flex-col gap-1 my-5">
    <UButton
      class="p-0 group"
      color="neutral"
      variant="link"
      trailing-icon="i-lucide-chevron-down"
      :ui="{
        trailingIcon: text.length > 0 ? 'group-data-[state=open]:rotate-180 transition-transform duration-200' : 'hidden'
      }"
      :label="isStreaming ? 'Thinking...' : 'Thoughts'"
    />

    <template #content>
      <div v-for="(value, index) in lines" :key="index">
        <span class="whitespace-pre-wrap text-sm text-muted font-normal">{{ value }}</span>
      </div>
    </template>
  </UCollapsible>
</template>
