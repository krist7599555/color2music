<template>
  <div class="home">
    <ColorPicker />
  </div>
</template>

<script>
// @ is an alias to /src
import ColorPicker from '@/components/ColorPicker.vue'

export default {
  name:       'Home',
  components: { ColorPicker },
}
</script>
