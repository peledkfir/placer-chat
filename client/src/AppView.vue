<template>
  <v-app>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class AppView extends Vue {
}
</script>
