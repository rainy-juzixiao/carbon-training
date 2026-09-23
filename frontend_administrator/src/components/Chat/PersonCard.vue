<template>
  <div class="person-card" :class="{ activeCard: personInfo.userId == current }">
    <div class="info">
          <HeadPortrait :imgUrl="personInfo.userAvatar"></HeadPortrait>
          <div class="info-detail">
            <div style="display: flex;justify-content: space-between">
              <div class="name">{{ personInfo.userName }}</div>
              <div class="time">{{ personInfo.messageTime}}</div>
            </div>
            <div style="display: flex;justify-content: space-between">
              <div class="detail">{{ personInfo.message }}</div>
              <div class="number">{{personInfo.number}}</div>
            </div>
          </div>
    </div>
  </div>
</template>

<script>
import HeadPortrait from "./HeadPortrait.vue";

export default {
  props: {
    personInfo: {
      default: {
      },
    },
    pcCurrent: {
      default: ''
    }
  },
  components: {
    HeadPortrait,
  },
  data() {
    return {
      current: '',
    }
  },
  watch: {
    pcCurrent: function() {
      this.isActive()
    }
  },
  methods: {
    isActive() {
      this.current = this.pcCurrent
    },
    getTime(timestamp){
      const date = new Date(timestamp);

      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 注意月份是从0开始的，所以要加1
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
};
</script>

<style lang="scss" scoped>
.number{
  color: #fff;
  background: red;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
}
.person-card {
  width: 250px;
  height: 80px;
  border-radius: 10px;
  background-color: rgb(50, 54, 68);
  position: relative;
  margin: 25px 0;
  cursor: pointer;
  .info {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;
    .info-detail {
      flex-direction: column;
      font-size: 14px;
      margin-top: 5px;
      margin-left: 20px;
      .name {
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 5px;
      }
      .detail {
        color: #5c6675;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
      }
      .time{
        color: #5c6675;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
      }
    }
  }
  &:hover {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
    // box-shadow:  0 5px 20px rgba(251, 152, 11, .5);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
  }
}
.activeCard {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 3px 2px 10px 0px rgba(0, 136, 255);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
}
</style>
