<template>
  <div>
    <article class="message is-dark" :class="{'is-danger': breach.IsSensitive, 'is-primary': !breach.IsVerified, 'is-info': breach.IsSpamList, 'is-warning': breach.IsFabricated}">
      <header class="message-header">
        <h1 class="has-white-text">
          <span class="has-text-grey-light subtitle is-size-6">{{ idx }}.&nbsp;</span>
          <a :href="monitorLink(breach.Name)" target="_blank" rel="noreferrer noopener"><strong class="title is-uppercase is-size-5">{{ breach.Title }}</strong></a>
        </h1>
        <div class="message-footer tags" v-if="tags.length">
          <a :href="tag.href"
            class="tag is-rounded is-small is-bordered"
            v-html="tag.label"
            v-for="tag in tags"
            :key="tag.label"
            :class="tag.cls" />
        </div>
      </header>
      <section class="message-body has-text-left">
        <figure class="image is-48x48 is-pulled-right">
          <img v-lazy="breach.LogoPath" :alt="breach.Title" />
        </figure>

        <div class="content">
          <p v-if="breach.Domain"><span :class="labelClass">Domain:</span> {{ breach.Domain }}</p>
          <p><span :class="labelClass">Breach Date:</span> <time :datetime="breach.BreachDate">{{ breach.BreachDate | dateFormat }}</time></p>
          <p><span :class="labelClass">Added Date:</span> <time :datetime="breach.AddedDate">{{ breach.AddedDate | dateFormat }}</time> &nbsp; <small class="has-text-grey">(+{{ dateDiffAdded() }} days)</small></p>
          <p v-if="!this.isSameDate()"><span :class="labelClass">Modified Date:</span> <time :datetime="breach.ModifiedDate">{{ breach.ModifiedDate | dateFormat }}</time> &nbsp; <small class="has-text-grey">(+{{ dateDiffModified() }} days)</small></p>
          <p><span :class="labelClass">Compromised Accounts:</span> {{ breach.PwnCount | numberFormat }}</p>
          <p><span :class="labelClass">Compromised Data:</span>
            <span class="tags">
              <a :href="dataClassHref(dataClass)"
                class="tag button is-outlined"
                v-for="dataClass in breach.DataClasses"
                v-text="dataClass"
                :key="dataClass" />
            </span></p>

          <blockquote class="is-size-7">
            <p v-html="breach.Description" class="has-text-black" />
          </blockquote>
        </div>
      </section>
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
    breach: {
      type: Object,
      required: true
    },
    idx: {
      type: Number,
      required: true
    }
  },
  computed: {
    tags() {
      const arr = [];
      this.breach.Domain === "" &&
        arr.push({
          cls: "is-light",
          label: "No domain", // `No domain ${this.icon("has-text-danger")}`,
          href: `?q=domain&value=`
        });
      !this.breach.IsVerified &&
        arr.push({
          cls: "is-primary",
          label: "Unverified",
          href: "?q=IsVerified&value=false"
        });
      this.breach.IsFabricated &&
        arr.push({
          cls: "is-warning",
          label: "Fabricated",
          href: "?q=IsFabricated&value=true"
        });
      this.breach.IsSensitive &&
        arr.push({
          cls: "is-danger",
          label: "Sensitive",
          href: "?q=IsSensitive&value=true"
        });
      this.breach.IsRetired && arr.push({ cls: "is-dark", label: "Retired" });
      this.breach.IsSpamList &&
        arr.push({
          cls: "is-info",
          label: "Spam List",
          href: "?q=IsSpamList&value=true"
        });

      return arr;
    }
  },
  methods: {
    dataClassHref(value) {
      return `?q=data&value=${encodeURIComponent(value)}`;
    },
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
    icon(name) {
      return `<span class="icon"><i class="fas ${name}" /></span>`;
    },
    isSameDate() {
      const { AddedDate, ModifiedDate } = this.breach;
      return this.dateFormat(AddedDate) === this.dateFormat(ModifiedDate);
    },
    monitorLink(value) {
      return `https://monitor.firefox.com/?breach=${encodeURIComponent(value)}`;
    }
  },
  filters: {
    classes(value) {
      return value.join(", ");
    }
  },
  data() {
    return {
      labelClass: ["has-text-weight-bold", "title", "is-6"]
    };
  }
};
</script>

<style scoped>
.is-bordered {
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.content time {
  padding: 12px;
}
</style>
