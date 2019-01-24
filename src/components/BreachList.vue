<template>
  <div>
    <h1 v-if="loading" class="button is-loading">Loading...</h1>

    <form method="get" v-else>
      <input type="hidden" name="q" value="search" />
      <div class="field has-addons">
        <div class="control">
          <input class="input" name="value" :value="searchTerm" type="search" placeholder="Title" />
        </div>
        <div class="control">
          <input type="submit" value="Search" class="button is-primary" />
        </div>
      </div>

      <div class="has-text-left">
        <p>
          <span class="has-text-weight-bold">Total Breaches:&nbsp;</span>
          <span v-if="filteredBreachesPercent === 100" v-text="this.totalBreachesCount" />
          <span v-else>{{ this.filteredBreachesCount }} of {{ this.totalBreachesCount }} <small>({{ filteredBreachesPercent | percentFormat }})</small></span>
          <span> since {{ this.startDate | dateFormat }}</span>
        </p>
        <p>
          <span class="has-text-weight-bold">Total Compromised Accounts:&nbsp;</span> 
          <span v-if="this.filteredCompromisedAccountsCount === this.totalCompromisedAccountsCount">{{ this.totalCompromisedAccountsCount | numberFormat }}</span>
          <span v-else>{{ this.filteredCompromisedAccountsCount | numberFormat }} of {{ this.totalCompromisedAccountsCount | numberFormat }} <small>({{ filteredCompromisedAccountsPercent | percentFormat }})</small></span>
        </p>
        <hr />
      </div>
    </form>

    <section class="columns is-multiline">
      <Breach class="column is-one-third-widescreen is-half-tablet"
        v-for="(breach, idx) in filteredBreaches"
        :key="breach.Name"
        :breach="breach"
        :idx="idx+1" />
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
    totalBreachesCount() {
      return this.sortedBreaches.length;
    },
    totalCompromisedAccountsCount() {
      return this.sortedBreaches.reduce(
        (sum, { PwnCount }) => sum + PwnCount,
        0
      );
    },
    searchTerm() {
      return (this.q === "search" && this.value) || "";
    },
    filteredBreachesCount() {
      return this.filteredBreaches.length;
    },
    filteredCompromisedAccountsCount() {
      return this.filteredBreaches.reduce(
        (sum, { PwnCount }) => sum + PwnCount,
        0
      );
    },
    filteredCompromisedAccountsPercent() {
      return (
        (this.filteredCompromisedAccountsCount /
          this.totalCompromisedAccountsCount) *
        100
      );
    },
    filteredBreachesPercent() {
      return (this.filteredBreachesCount / this.totalBreachesCount) * 100;
    },
    filteredBreaches() {
      switch (this.q) {
        case "search":
          return this.sortedBreaches.filter(breach => {
            const v = this.value.toLowerCase();
            return (
              breach.Name.toLowerCase().includes(v) ||
              breach.Title.toLowerCase().includes(v) ||
              breach.Domain.toLowerCase().includes(v)
            );
          });

        case "data":
          return this.sortedBreaches.filter(breach =>
            breach.DataClasses.includes(this.value)
          );

        case "IsSensitive":
        case "IsSpamList":
        case "IsVerified":
        case "IsFabricated": {
          const v = this.value === "true";
          return this.sortedBreaches.filter(breach => breach[this.q] === v);
        }

        case "domain": {
          const v = this.value || "";
          return this.sortedBreaches.filter(breach => breach.Domain === v);
        }
      }

      return this.sortedBreaches;
    },
    oldestBreach() {
      return [...this.filteredBreaches]
        .sort(this.sortByDate("BreachDate"))
        .pop().BreachDate;
    },
    sortedBreaches() {
      return [...this.breaches]
        .filter(({ BreachDate }) => new Date(BreachDate) >= this.startDate)
        .sort(this.sortByDate(this.sortBy));
    }
  },
  data() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      q: urlParams.get("q"),
      value: urlParams.get("value"),
      sortBy: urlParams.get("sortBy") || "ModifiedDate",
      startDate: new Date(urlParams.get("startDate") || 0),
      breaches: [],
      loading: true
    };
  },
  methods: {
    sortByDate(col) {
      return (breachA, breachB) =>
        new Date(breachB[col]) - new Date(breachA[col]);
    }
  },
  async mounted() {
    const res = await axios.get("https://haveibeenpwned.com/api/v2/breaches");
    this.breaches = res.data;
    this.loading = false;
    this.startDate = new Date(this.oldestBreach);
  }
};
</script>
