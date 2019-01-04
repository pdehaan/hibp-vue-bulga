<template>
  <main id="app">
    <section class="section">
      <BreachList class="container"/>
    </section>
  </main>
</template>

<script>
import "bulma/css/bulma.min.css";
import BreachList from "./components/BreachList.vue";

export default {
  name: "app",
  components: {
    BreachList
  }
};
</script>

<style>
#app {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 60px;
  text-align: center;
}
</style>
