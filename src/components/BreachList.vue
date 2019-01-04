<template>
  <div>
    <nav v-if="false">
      <label class="checkbox">Verified? <input type="checkbox" name="Verified" v-model="IsVerified" /></label><br/>
      <label class="checkbox">Fabricated? <input type="checkbox" name="Fabricated" v-model="IsFabricated" /></label><br/>
      <label class="checkbox">Sensitive? <input type="checkbox" name="Sensitive" v-model="IsSensitive" /></label><br/>
      <label class="checkbox">Retired? <input type="checkbox" name="Retired" v-model="IsRetired" /></label><br/>
      <label class="checkbox">Spam List? <input type="checkbox" name="SpamList" v-model="IsSpamList" /></label><br/>
    </nav>

    <section class="columns is-multiline">
      <Breach class="column is-half" v-for="(breach, idx) in filteredBreaches.splice(0, 100)" :key="breach.Name" :breach="breach" :idx="idx+1" />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import Breach from "./Breach.vue";

export default {
  name: "BreachList",
  components: {
    Breach
  },
  computed: {
    filteredBreaches() {
      const sorted = this.sortedBreaches;
      return sorted.filter(breach => breach);
      /*
      return sorted.filter(breach =>
        breach.IsVerified === this.IsVerified &&
        breach.IsFabricated === this.IsFabricated &&
        breach.IsSensitive === this.IsSensitive &&
        breach.IsRetired === this.IsRetired &&
        breach.IsSpamList === this.IsSpamList);
      */
    },
    sortedBreaches() {
      const sortByDate = col => (breachA, breachB) =>
        new Date(breachB[col]) - new Date(breachA[col]);
      return [...this.breaches].sort(sortByDate("ModifiedDate"));
    }
  },
  data() {
    return {
      breaches: []
      // IsVerified: true,
      // IsFabricated: false,
      // IsSensitive: false,
      // IsRetired: false,
      // IsSpamList: false
    };
  },
  async mounted() {
    const res = await axios.get("https://haveibeenpwned.com/api/v2/breaches");
    this.breaches = res.data;
  }
};
</script>
