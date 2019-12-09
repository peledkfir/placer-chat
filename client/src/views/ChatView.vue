<template>
  <v-container>
    <v-row no-gutters justify="center">
      <v-col cols="11" md="7" v-for="(message, i) in messages" :key="i" :class="{ 'offset-1': isMe(message) }">
        <message-view v-if="message.author" :message="message"></message-view>
        <div class="mb-3" v-else>
          {{ nickName(message.id) }} {{ $t(message.status === "online" ? "connected" : "disconnected") }}
          <small>{{ new Date(message.time) | moment("LT") }}</small>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters justify="center">
      <v-col cols="11" md="7" class="ml-10">
        <v-form ref="form" @submit.prevent="sendMessage">
          <v-text-field v-model="localMe" :label="$t('userLabel')" @input="nicknameChange()"></v-text-field>
          <v-text-field
            v-model="newMessageText"
            :placeholder="$t('messageinput.placeholder')"
            @keyup.enter="sendMessage"
          >
            <v-btn @click.prevent="submit" slot="append" icon><v-icon>send</v-icon></v-btn>
          </v-text-field>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import * as _ from "lodash";
import MessageView from "./MessageView.vue";

@Component({
  components: {
    MessageView
  }
})
export default class ChatView extends Vue {
  created() {
    this.$store.dispatch("bindOnlineStatsRef");
    this.$store.dispatch("bindUsersRef");
    this.$store.dispatch("bindMessagesRef");
  }

  private newMessageText = "";
  private localMe = "";

  get me() {
    return this.$store.getters.me;
  }

  get messages() {
    return this.$store.getters.messages;
  }

  get nickName(): (id: string) => string {
    return (id: string) => {
      const user = this.$store.getters.users[id];
      return user ? user.name : `Anonymous-${id.substring(0, 5)}`;
    };
  }

  nicknameChange = _.debounce(() => {
    this.updateName();
  }, 3000);

  updateName() {
    this.$store.dispatch("updateName", this.localMe);
  }

  isMe(message: any) {
    return message && message.author === this.me.id;
  }

  sendMessage() {
    this.$store.dispatch("sendMessage", {
      text: this.newMessageText
    });

    this.newMessageText = "";
  }

  updated() {
    const formEl = (this.$refs.form as Vue).$el;
    formEl.scrollIntoView();
  }

  @Watch("me", { deep: true })
  onPropertyChanged(value: any) {
    if (value && value.name !== this.localMe && !this.localMe) {
      this.localMe = value.name;
    }
  }
}
</script>

<style lang="scss">
.ml-10 {
  margin-left: 40px !important;
}
</style>
