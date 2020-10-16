const ws = require('nodejs-websocket');
// 这里用到了moment，请大家自行安装
const moment = require('moment');

console.log('开始建立连接...');

const users = [];

// 向所有连接的客户端广播
function boardcast(obj) {
  // eslint-disable-next-line no-use-before-define
  server.connections.forEach((conn) => {
    conn.sendText(JSON.stringify(obj));
  });
}

function getDate() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

const server = ws
  .createServer((conn) => {
    conn.on('text', (obj) => {
      // eslint-disable-next-line no-param-reassign
      obj = JSON.parse(obj);

      if (obj.type === 1) {
        users.push({
          nickname: obj.nickname,
          uid: obj.uid,
        });
        boardcast({
          type: 1,
          date: getDate(),
          msg: `${obj.nickname} join the room`,
          users,
          uid: obj.uid,
          nickname: obj.nickname,
        });
      } else {
        boardcast({
          type: 2,
          date: getDate(),
          msg: obj.msg,
          uid: obj.uid,
          nickname: obj.nickname,
        });
      }
    });
    conn.on('close', (code, reason) => {
      console.log('关闭连接', code, reason);
    });
    conn.on('error', (code, reason) => {
      console.log('异常关闭', code, reason);
    });
  })
  .listen(8001);

console.log('WebSocket建立完毕', 'http://127.0.0.1:8001');
