<template>
  <main id="app">
    <section class="hero">
      <div class="hero-body">
        <div class="container has-text-left">
          <h1 class="title is-size-1"><a href="/">Have You Been Pwned?</a></h1>
          <h2 class="subtitle">Breach List</h2>
        </div>
      </div>
    </section>
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
