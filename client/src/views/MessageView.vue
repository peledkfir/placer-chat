<template>
  <v-card class="mb-3" :class="{ 'green lighten-5': isMe(message) }">
    <v-card-title class="subtitle-1 font-weight-bold" :class="{ 'justify-end': isMe(message) }">
      <v-avatar size="35" class="mr-3" v-if="!isMe(message)">
        <v-img :src="`https://robohash.org/${message.author}?set=set4&size=60x60`"></v-img>
      </v-avatar>
      {{ nickName(message.author) }}
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
        {{ message.time ? message.time.toDate() : new Date() | moment("from") }}
      </small>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class MessageView extends Vue {
  @Prop({ default: {} })
  private message!: any;

  get me() {
    return this.$store.getters.me;
  }

  get nickName(): (id: string) => string {
    return (id: string) => {
      const user = this.$store.getters.users[id];
      return user ? user.name : `Anonymous-${id.substring(0, 5)}`;
    };
  }

  isMe(message: any) {
    return message && message.author === this.me.id;
  }
}
</script>
