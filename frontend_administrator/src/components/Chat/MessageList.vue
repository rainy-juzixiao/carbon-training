<template>
  <div class="chat-window">
    <div class="top">
      <div style="display: flex;justify-content: flex-end">

        <div class="info-detail">
          <!--    当前对话的用户      -->
          <div class="name">{{ friendInfo.name }}</div>
        </div>
        <button @click="closeSession" style="line-height: 24px;text-align: center">
          <i class="el-icon-phone" style="font-size: 24px;color: red;margin: 10px;"></i>
          结束会话
        </button>
      </div>
    </div>

    <div class="bottom">
      <div class="chat-content" ref="chatContent">
        <div class="chat-wrapper" v-for="item in chatList" :key="item + Math.random() + new Date().getTime()">
          <!--     不是验证消息       -->
          <div v-if="item.event !== 'AUTHENTICATION'">
            <!--    客户      -->
            <div class="chat-friend" v-if="item.identity === 'USER'">
              <div class="info-time">
                <img :src="item.senderAvatar ? item.senderAvatar : userImage" alt=""/>
                <span>{{ item.sendName }}</span>
                <span>{{ getTime(item.messageTime) }}</span>
              </div>
              <div class="chat-text">
                {{ item.content }}
              </div>
            </div>
            <!--    我 （客服）      -->
            <div class="chat-me" v-else-if="item.identity === 'ADMIN' || item.identity === 'ROBOT'">
              <div class="info-time">
                <span>{{ item.sendName }}</span>
                <span>{{ getTime(item.messageTime) }}</span>
                <img v-if="item.identity === 'ADMIN'" src="@/assets/images/kefu.svg" alt=""/>
                <img v-if="item.identity === 'ROBOT'" src="@/assets/logo/logo.png" alt=""/>
              </div>
              <div class="chat-text">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 4fr 1fr;">
        <el-popover placement="top">
          <template #reference>
            <el-button class="button">表情图标</el-button>
          </template>

          <div style="display: grid; grid-template-columns: repeat(5, 1fr); width: 250px;">
            <div v-for="(icon, index) in icons" style="height: 1.5em">
              <i ref="icons" :class="icon" @click="addIcon(index)"></i>
            </div>
          </div>
        </el-popover>
        <el-input v-model="userInputMessage"></el-input>
        <span>
        <el-button class="button" @click="sendMessage" @keyup.enter.native="sendMessage">发送</el-button>
      </span>
      </div>
    </div>
  </div>
</template>

<script>

import HeadPortrait from '@/components/Chat/HeadPortrait'
import Emoji from '@/components/Chat/Emoji'
import FileCard from '@/components/Chat/FileCard.vue'
import {parseTime} from '../../utils/neu'

export default {
  components: {
    HeadPortrait,
    Emoji,
    FileCard
  },
  props: ['chatList','friendInfo'],
  data() {
    return {
      userInputMessage: '',
      showEmoji: false,
      userImage: require('@/assets/images/head_portrait.jpg'),

      icons: [
        'el-icon-platform-eleme',
        'el-icon-eleme',
        'el-icon-delete-solid',
        'el-icon-delete',
        'el-icon-s-tools',
        'el-icon-setting',
        'el-icon-user-solid',
        'el-icon-user',
        'el-icon-phone',
        'el-icon-phone-outline',
        'el-icon-more',
        'el-icon-more-outline',
        'el-icon-star-on',
        'el-icon-star-off',
        'el-icon-s-goods',
        'el-icon-goods',
        'el-icon-warning'
      ]
    }
  },
  methods: {
    //关闭会话
    closeSession() {
      this.$emit('closeSession')
    },

    addIcon(index) {
      const content = getComputedStyle(this.$refs.icons[index], '::before')
        .getPropertyValue('content')
      this.userInputMessage += content.slice(1, content.length - 1)
    },

    getTime(timestamp) {
      return parseTime(timestamp)
    },
    getNowDateTime() {
      return this.getTime(new Date().getTime())
    },


    //发送文字信息
    sendMessage() {
      if (this.userInputMessage) {
        this.$emit('sendText', this.userInputMessage)
        this.userInputMessage = ''
      }
      this.scrollBottom()
    },

    //获取窗口高度并滚动至最底层
    scrollBottom() {
      this.$nextTick(() => {
        const scrollDom = this.$refs.chatContent
        this.animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight)
      })
    },
    animation(obj, target, fn1) {
      // console.log(fn1);
      // fn是一个回调函数，在定时器结束的时候添加
      // 每次开定时器之前先清除掉定时器
      clearInterval(obj.timer)
      obj.timer = setInterval(function () {
        // 步长计算公式  越来越小
        // 步长取整
        var step = (target - obj.scrollTop) / 10
        step = step > 0 ? Math.ceil(step) : Math.floor(step)
        if (obj.scrollTop >= target) {
          clearInterval(obj.timer)
          // 如果fn1存在，调用fn
          if (fn1) {
            fn1()
          }
        } else {
          // 每30毫秒就将新的值给obj.left
          obj.scrollTop = obj.scrollTop + step
        }
      }, 10)
    },
  }
}
</script>

<style lang="scss" scoped>
.chat-window {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  position: relative;

  .top {
    margin-bottom: 50px;

    &::after {
      content: "";
      display: block;
      clear: both;
    }

    .head-pic {
      float: left;
    }

    .info-detail {
      float: left;
      margin: 5px 20px 0;

      .name {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }

      .detail {
        color: #9e9e9e;
        font-size: 12px;
        //margin-top: 2px;
      }

    }

    .other-fun {
      float: right;
      margin-top: 20px;

      span {
        margin-left: 30px;
        cursor: pointer;
      }

      // .icon-tupian {

      // }
      input {
        display: none;
      }
    }
  }

  .bottom {
    width: 100%;
    height: 70vh;
    background-color: rgb(50, 54, 68);
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;

    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding: 20px;
      box-sizing: border-box;
      font-family: element-icons, serif;

      &::-webkit-scrollbar {
        width: 0; /* Safari,Chrome 隐藏滚动条 */
        height: 0; /* Safari,Chrome 隐藏滚动条 */
        display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
      }

      .chat-wrapper {
        position: relative;
        word-break: break-all;

        .chat-friend {
          width: 100%;
          float: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .chat-text {
            max-width: 90%;
            padding: 20px;
            border-radius: 5px 20px 20px 20px;
            background-color: rgb(56, 60, 75);
            color: #fff;
            box-shadow: #ccc 2px 2px 5px;
            &:hover {
              background-color: rgb(39, 42, 55);
            }
          }

          .chat-img {
            img {
              width: 100px;
              height: 100px;
            }
          }

          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }

            span:last-child {
              color: rgb(101, 104, 115);
              margin-left: 10px;
              vertical-align: middle;
            }
          }
        }

        .chat-me {
          width: 100%;
          float: right;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;

          .chat-text {
            box-shadow: #ccc 2px 2px 5px;
            float: right;
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 5px 20px 20px;
            background-color: white;
            color: #000000;
          }

          .chat-img {
            img {
              max-width: 300px;
              max-height: 200px;
              border-radius: 10px;
            }
          }

          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-left: 10px;
            }

            span {
              line-height: 30px;
            }

            span:first-child {
              color: rgb(101, 104, 115);
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }

    .chatInputs {
      width: 90%;
      position: absolute;
      bottom: 0;
      margin: 3%;
      display: flex;

      .boxinput {
        width: 50px;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 1px solid rgb(80, 85, 103);
        position: relative;
        cursor: pointer;

        img {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .emoji {
        transition: 0.3s;

        &:hover {
          background-color: rgb(46, 49, 61);
          border: 1px solid rgb(71, 73, 82);
        }
      }

      .inputs {
        font-family: element-icons,serif;

        width: 90%;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 2px solid rgb(34, 135, 225);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 20px;
        color: #fff;
        font-weight: 100;
        margin: 0 20px;

        &:focus {
          outline: none;
        }
      }

      .send {
        background-color: rgb(29, 144, 245);
        border: 0;
        transition: 0.3s;
        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);

        &:hover {
          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
        }
      }
    }
  }
}
</style>
