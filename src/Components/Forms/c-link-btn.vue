<template>
    <a href="javascript:;" @click.prevent="handleEmit()">
           <span>
            {{ label }}
           </span>

    </a>
</template>

<script setup>
const emit = defineEmits(['create-button'])
const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    uri: {
        type: String,
        default: ""
    },
})

const handleEmit = () => {
    let data = {}
    data = {route: props.uri, params: [], method: "get"}
    emit('create-button', data)
}
</script>

<style scoped>

</style>