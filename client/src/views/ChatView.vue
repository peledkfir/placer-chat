<template>
  <v-container class="justify-center">
    <v-layout column align-center justify-center>
      <v-card v-for="(message, i) in messages" :key="i" width="550" class="mb-3" :class="{ 'ml-10 green lighten-5': isMe(message) }">
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
            {{ $moment(message.time).fromNow() }}
          </small>
        </v-card-subtitle>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class ChatView extends Vue {
  private messages = [
    { author: "Tom Shelbi", time: 1575899605000, text: "Yo" },
    { author: "Arthur Shelbi", time: 1575899645000, text: "Yo" },
    {
      author: "Arthur Shelbi",
      time: 1575903618000,
      text:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
  ];

  private me = "Arthur Shelbi";

  isMe(message: any) {
    return message && message.author === this.me;
  }
}
</script>

<style lang="scss">
.ml-10 {
  margin-left: 40px !important;
}
</style>
