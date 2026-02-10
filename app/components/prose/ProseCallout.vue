<script setup lang="ts">
const props = defineProps<{
  type?: string
}>()

const ALERT_TYPES: Record<string, { icon: string, color: string, label: string }> = {
  note: { icon: 'i-lucide-info', color: 'info', label: 'Note' },
  tip: { icon: 'i-lucide-lightbulb', color: 'success', label: 'Tip' },
  warning: { icon: 'i-lucide-triangle-alert', color: 'warning', label: 'Warning' },
  caution: { icon: 'i-lucide-circle-alert', color: 'error', label: 'Caution' }
}

const config = computed(() => {
  const key = props.type?.toLowerCase()
  return key ? ALERT_TYPES[key] ?? null : null
})
</script>

<template>
  <div
    v-if="config"
    class="my-4 rounded-lg border-l-4 px-4 py-3"
    :class="{
      'border-info bg-info/10': config.color === 'info',
      'border-success bg-success/10': config.color === 'success',
      'border-warning bg-warning/10': config.color === 'warning',
      'border-error bg-error/10': config.color === 'error'
    }"
  >
    <div
      class="mb-1 flex items-center gap-1.5 font-semibold"
      :class="{
        'text-info': config.color === 'info',
        'text-success': config.color === 'success',
        'text-warning': config.color === 'warning',
        'text-error': config.color === 'error'
      }"
    >
      <UIcon :name="config.icon" class="size-4" />
      <span class="text-sm">{{ config.label }}</span>
    </div>
    <div class="text-sm text-muted [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
      <slot />
    </div>
  </div>

  <div v-else class="my-4 rounded-lg border-l-4 border-accented px-4 py-3">
    <slot />
  </div>
</template>
