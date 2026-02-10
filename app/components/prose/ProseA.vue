<script setup lang="ts">
const props = defineProps<{
  href?: string
  target?: string
}>()

const isExternal = computed(() =>
  !!props.href && (props.href.startsWith('http://') || props.href.startsWith('https://'))
)

const linkTarget = computed(() => props.target || (isExternal.value ? '_blank' : undefined))
const linkRel = computed(() => isExternal.value ? 'noopener noreferrer' : undefined)
</script>

<template>
  <a
    :href="href"
    :target="linkTarget"
    :rel="linkRel"
    class="text-primary font-medium border-b border-primary/40 hover:border-primary transition-colors"
  >
    <slot />
    <UIcon
      v-if="isExternal"
      name="i-lucide-external-link"
      class="size-3 ml-0.5 mb-0.5 inline-block align-baseline"
    />
  </a>
</template>
