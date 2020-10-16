<template>
  <div v-if="visible" class="login-dialog-wrapper">
    <div class="login-area">
      <h1>login</h1>

      <span>input your name here: &nbsp;</span>
      <input type="text" v-model="username" />

      <button @click="login">login</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      username: '',
    };
  },
  methods: {
    login() {
      if (this.username) {
        this.$emit('login', this.username);
      }
    },
  },
};
</script>

<style scoped>
.login-dialog-wrapper {
  position: absolute;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  background: rgba(71, 71, 71, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.login-dialog-wrapper .login-area {
  padding: 50px 24px;
  background: rgb(223, 223, 223);
  border-radius: 14px;

  transition: all ease-in;
}
</style>
