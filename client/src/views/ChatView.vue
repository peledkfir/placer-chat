<template>
  <v-container>
    <v-row no-gutters justify="center">
      <v-col cols="11" md="7" v-for="(message, i) in messages" :key="i" :class="{ 'offset-1': isMe(message) }">
        <v-card class="mb-3" :class="{ 'green lighten-5': isMe(message) }">
          <v-card-title class="subtitle-1 font-weight-bold" :class="{ 'justify-end': isMe(message) }">
            <v-avatar size="35" class="mr-3" v-if="!isMe(message)">
              <v-img :src="`https://robohash.org/${message.author}?set=set4&size=60x60`"></v-img>
            </v-avatar>
            {{ message.author }}
            <v-avatar size="35" class="ml-3" v-if="isMe(message)">
              <v-img :src="`https://robohash.org/${message.author}?set=set4&size=60x60`"></v-img>
            </v-avatar>
          </v-card-title>
          <v-card-text class="font-weight-light">
            {{ message.text }}
          </v-card-text>
          <v-card-subtitle>
            <small class="grey--text lighten-2">
              <v-icon :small="true">access_time</v-icon>
              <!-- currently it won't update periodically -->
              {{ message.time | moment("from") }}
            </small>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters justify="center">
      <v-col cols="11" md="7" class="ml-10">
        <v-form ref="form" @submit.prevent="sendMessage">
          <v-layout>
            <v-text-field v-model="newMessageText" :placeholder="$t('messageinput.placeholder')">
              <v-btn slot="append" icon><v-icon>send</v-icon></v-btn>
            </v-text-field>
          </v-layout>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class ChatView extends Vue {
  created() {
    this.$store.dispatch("bindMessagesRef");
  }

  private me = "Arthur Shelbi";
  private newMessageText = "";

  get messages() {
    return this.$store.getters.messages;
  }

  isMe(message: any) {
    return message && message.author === this.me;
  }

  sendMessage() {
    this.$store.dispatch("sendMessage", {
      author: this.me,
      time: new Date().getTime(),
      text: this.newMessageText
    });

    this.newMessageText = "";
  }
}
</script>

<style lang="scss">
.ml-10 {
  margin-left: 40px !important;
}
</style>
