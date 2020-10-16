<template>
  <div>
    <Login :visible="visible" @login="login" />

    <div class="web-im">
      <!-- <h1 class="header im-title">chat room</h1> -->

      <div class="content im-record" ref="content">
        <div
          class="li"
          :key="item.uid + index"
          :class="[item.uid == uid && item.type !== 1 ? 'user' : 'other']"
          v-for="(item, index) in messageList"
        >
          <div v-if="item.type === 1" class="join-tips">{{ item.msg }}</div>

          <div v-else>
            <template v-if="isSelf(item)">
              <span class="message-box">{{ item.msg }}</span>

              <span class="img">{{ item.nickname }}</span>
            </template>

            <template v-else>
              <span class="img">{{ item.nickname }}</span>
              <span class="message-box">{{ item.msg }}</span>
            </template>
          </div>
        </div>
      </div>

      <div class="footer im-input">
        <Toolbar />

        <input type="text" class="input" v-model="msg" placeholder="请输入内容" />
        <button @click="send" class="button">发送</button>
      </div>

      <!-- nickname: {{ nickname }} -->
    </div>

    <Footer />
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import Login from './LoginDialog.vue';
import Footer from './Footer.vue';
import Toolbar from './Toolbar/Toolbar.vue';

export default {
  name: 'HelloWorld',
  components: {
    Login,
    Toolbar,
    Footer,
  },
  created() {
    this.initUser();
  },
  data() {
    return {
      user: 0,
      nickname: '',
      visible: false,
      msg: '',
      socket: null,
      messageList: [],
    };
  },
  methods: {
    isSelf(item) {
      return item.uid === this.uid && item.type !== 1;
    },
    initUser() {
      const user = JSON.parse(localStorage.getItem('WEB_IM_USER'));

      console.log('user', user);

      if (!user || !user.name) {
        this.visible = true;
        return;
      }

      this.uid = user.uid;
      this.nickname = user.name;

      this.conWebSocket();

      document.onkeydown = (event) => {
        const e = event || window.event;
        if (e && e.keyCode === 13) {
          this.send();
        }
      };
    },

    login(username) {
      const user = {
        name: username,
        uid: uuidv4(),
      };
      localStorage.setItem('WEB_IM_USER', JSON.stringify(user));

      this.initUser();
      this.visible = false;
    },
    conWebSocket() {
      if (window.WebSocket) {
        this.socket = new WebSocket('ws://106.15.189.174:8001');
        const { socket } = this;

        socket.onopen = (e) => {
          console.log('连接服务器成功', e);

          this.sendMessage(1);
        };
        socket.onclose = (e) => {
          console.log('服务器关闭', e);
        };
        socket.onerror = () => {
          console.log('连接出错');
        };
        // 接收服务器的消息
        socket.onmessage = (e) => {
          console.log('onmessage', e);

          const message = JSON.parse(e.data);
          this.messageList.push(message);
        };
      }
    },
    send() {
      if (!this.msg) {
        return;
      }
      this.sendMessage(2, this.msg);
    },

    sendMessage(type, msg = '') {
      this.socket.send(
        JSON.stringify({
          uid: this.uid,
          type,
          nickname: this.nickname,
          msg,
        }),
      );

      this.msg = '';

      this.scrollToBottom();
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const chatContent = this.$refs.content;

        console.log(chatContent.scrollTop, chatContent.scrollHeight);
        chatContent.scrollTop = chatContent.scrollHeight;
        console.log(chatContent.scrollTop, chatContent.scrollHeight);
      });
    },
  },
};
</script>

<style scoped>
.web-im {
  width: 500px;
  height: 600px;
  margin: 20px auto;
  border: 1px solid rgb(197, 192, 192);
  border-radius: 4px;

  display: flex;
  flex-direction: column;
}

.im-title {
  text-align: center;
}

.content {
  flex: 1;
  flex-grow: 1;
  background: rgb(245, 245, 245);
  border: 1px solid rgb(209, 209, 209);
  border-left: none;
  border-right: none;

  padding: 12px 12px;

  overflow: auto;
}

.join-tips {
  text-align: center;
  width: 100%;
  padding: 8px 0;
  font-size: 12px;
  color: rgba(45, 45, 49, 0.5);
  font-weight: 800;
}

.user {
  /* background: rgba(253, 71, 71, 0.5); */
  text-align: end;

  display: flex;
  justify-content: flex-end;
}

.other {
  /* background: rgba(38, 121, 255, 0.5); */
  text-align: end;

  display: flex;
  justify-content: flex-start;
}

.li {
  margin: 14px 0;
  color: rgb(134, 134, 134);
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
}

.message-box {
  background: white;
  padding: 4px 8px;

  margin: 0 6px;
}

.footer {
  display: flex;
  justify-content: flex-end;

  box-sizing: border-box;
}

.footer .input {
  flex: 1;
  flex-grow: 1;

  margin: -1px;
  text-indent: 12px;
  border: 1px solid rgb(209, 209, 209);
  /* border-bottom-left-radius: 4px; */

  z-index: 99;
  transition: border 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.footer .button {
  height: 40px;
  border: none;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  outline: none;

  border-left: 1px solid rgb(209, 209, 209);
}

.input:focus {
  outline: none;
  border: 1px solid #409eff;
}
</style>
