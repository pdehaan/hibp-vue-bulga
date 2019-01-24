<template>
  <span class="icon"><i class="fas" :class="icon" /></span>
</template>

<script>
export default {
  name: "Icon",
  props: {
    icon: {
      type: String,
      required: true
    }
  }
};
</script>
