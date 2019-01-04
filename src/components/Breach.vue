<template>
  <div>
    <article class="card" :class="{'has-background-grey-lighter': breach.IsSensitive}">
      <header class="card-header has-background-dark" :class="{'has-background-danger': breach.IsSensitive, 'has-background-info': breach.IsSpamList, 'has-background-warning': breach.IsFabricated}">
        <h1 class="card-header-title has-text-light">{{ idx }}. {{breach.Title }}</h1>
      </header>
      <div class="card-content">
        <div class="content has-text-left">
          <figure class="image is-48x48 is-pulled-right">
            <img :src="breach.LogoPath" :alt="breach.Title" />
          </figure>

          <dl>
            <dt class="has-text-weight-bold" v-if="breach.Domain">Domain:</dt>
            <dd v-if="breach.Domain" v-text="breach.Domain"></dd>

            <dt class="has-text-weight-bold">Breach Date:</dt>
            <dd><time :datetime="breach.BreachDate">{{ breach.BreachDate | dateFormat }}</time></dd>
          
            <dt class="has-text-weight-bold">Added Date:</dt>
            <dd>
              <time :datetime="breach.AddedDate">{{ breach.AddedDate | dateFormat }}</time> &nbsp;
              <sup class="has-text-grey">(+{{ dateDiffAdded() }} days)</sup>
            </dd>

            <dt class="has-text-weight-bold" v-if="!this.isSameDate()">Modified Date:</dt>
            <dd v-if="!this.isSameDate()">
              <time :datetime="breach.ModifiedDate">{{ breach.ModifiedDate | dateFormat }}</time> &nbsp;
              <sup class="has-text-grey">(+{{ dateDiffModified() }} days)</sup>
              </dd>

            <dt class="has-text-weight-bold">Compromised Accounts:</dt>
            <dd>{{ breach.PwnCount | numberFormat }}</dd>

            <dt class="has-text-weight-bold">Compromised Data:</dt>
            <dd class="tags">
              <span class="tag" v-for="dataClass in breach.DataClasses" :key="dataClass" v-text="dataClass" />
            </dd>
          </dl>

          <div v-if="false">
            <hr />
            <p v-html="breach.Description" />
          </div>
        </div>
      </div>
      <footer class="card-footer" v-if="tags.length">
        <div class="card-footer-item tags">
          <span v-for="(tag, idx) in tags" :key="idx" class="tag is-rounded" :class="tag.cls" v-html="tag.label" />
        </div>
      </footer>
    </article>
  </div>
</template>

<script>
function msToDays(ms) {
  /* milliseconds * seconds * minutes * hours */
  return ms / 1000 / 60 / 60 / 24;
}

export default {
  name: "Breach",
  props: {
    breach: Object,
    idx: Number
  },
  computed: {
    prettyDomain() {
      const emptyDomain = `NO DOMAIN `;
      return this.breach.Domain || emptyDomain;
    },
    tags() {
      const arr = [];
      !this.breach.IsVerified &&
        arr.push({ cls: "is-primary", label: "Unverified" });
      this.breach.IsFabricated &&
        arr.push({ cls: "is-warning", label: "Fabricated" });
      this.breach.IsSensitive &&
        arr.push({ cls: "is-danger", label: "Sensitive" });
      this.breach.IsRetired && arr.push({ cls: "is-dark", label: "Retired" });
      this.breach.IsSpamList &&
        arr.push({ cls: "is-info", label: "Spam List" });
      this.breach.Domain === "" &&
        arr.push({
          cls: "is-light",
          label:
            "No Domain <span class='icon has-text-danger'><i class='fas fa-ban'></i></span>"
        });
      return arr;
    }
  },
  methods: {
    dateFormat(value) {
      return new Date(value).toLocaleDateString();
    },
    dateDiffAdded() {
      const { AddedDate, BreachDate } = this.breach;
      const diffMS =
        new Date(AddedDate).getTime() - new Date(BreachDate).getTime();
      return Math.ceil(msToDays(diffMS));
    },
    dateDiffModified() {
      const { AddedDate, ModifiedDate } = this.breach;
      const diffMS =
        new Date(ModifiedDate).getTime() - new Date(AddedDate).getTime();
      return Math.ceil(msToDays(diffMS));
    },
    isSameDate() {
      const { AddedDate, ModifiedDate } = this.breach;
      return this.dateFormat(AddedDate) === this.dateFormat(ModifiedDate);
    }
  },
  filters: {
    classes(value) {
      return value.join(", ");
    },
    dateFormat(value) {
      return new Date(value).toLocaleDateString();
    },
    numberFormat(value) {
      return Number(value).toLocaleString();
    }
  }
};
</script>
