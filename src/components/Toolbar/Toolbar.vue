<template>
  <div class="wrapper">
    <div class="pop-over">
      <ol v-clickoutside="close" v-show="open" class="pop-list">
        <li v-for="(image, index) in images" :key="index" @click="addEmogi(image, index)">
          <img fit="scale-down" :src="image" alt="emogi" class="emogi" />
        </li>
      </ol>

      <a @click="toggleOpen" class="pop-button" href="javascript: void(0);">
        <img :src="button" alt="emogi button" />
      </a>
    </div>
  </div>
</template>

<script>
const requireImages = require.context('./emojis', true, /^\.\/.*$/);

const images = [];

requireImages.keys().forEach((key) => {
  images.push(requireImages(key));
});

console.log('imageRegister', images);

export default {
  name: 'Toolbar',
  data() {
    return {
      toolbar: [''],
      images,
      open: false,
      // eslint-disable-next-line global-require
      button: require('@/assets/toolbar/emogi.png'),
    };
  },
  directives: {
    clickoutside: {
      bind(el, binding, vnode) {
        const documentHandler = (e) => {
          if (!vnode.context || el.contains(e.target)) return;
          binding.value(e);
        };

        setTimeout(() => {
          document.addEventListener('click', documentHandler);
        }, 0);
      },
    },
  },
  methods: {
    toggleOpen() {
      this.open = !this.open;
    },
    close(e) {
      if (this.$el.contains(e.target)) return;
      this.open = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  bottom: 0;
}
.emogi {
  width: 50px;
  height: 50px;

  background: #000;
}

.pop-over {
  position: relative;
  width: 100%;
  height: 100%;
}

.pop-button {
  position: relative;
  width: 100%;
  height: 100%;
  text-decoration: none;
  padding: 0 4px;

  display: flex;
  align-items: center;
}

.pop-list {
  position: absolute;
  left: 0;
  top: -140px;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 4px;

  width: 354px;
  // height: 200px;
  background: white;
  border: 1px solid rgb(209, 209, 209);
  box-shadow: 0 0 8px rgba(114, 114, 114, .5);

  z-index: 99999;

  li {
    display: inline-block;
    margin: 0;
    margin-left: -1px;
    margin-top: -1px;

    padding: 0;
    font-size: 0;

    padding: 4px;
    border: 1px solid rgb(209, 209, 209);

    width: 50px;
    height: 50px;
    list-style: none;
  }
}
</style>
