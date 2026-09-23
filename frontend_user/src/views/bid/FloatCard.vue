<script>
export default {
  name: 'FloatCard',
  props: ['bidBidding'],
  methods: {
    jumpTo(id) {
      this.$router.push(`/bid/detail?id=${id}`)
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      speedX: 3,
      speedY: 3,
      interval: -1,

      contentLeft: 0,
      speedContentLeft: 2,

      stopState: false
    }
  },
  mounted() {
    const container = this.$refs.container

    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    const content = this.$refs.content

    const contentClientWidth = content.clientWidth
    const contentScrollWidth = content.scrollWidth

    this.interval = setInterval(() => {
      if (this.stopState) return

      const width = document.documentElement.offsetWidth
      const height = document.documentElement.offsetHeight

      container.style.top = this.y + 'px'
      container.style.left = this.x + 'px'
      this.y += this.speedY
      this.x += this.speedX

      if (this.y + containerHeight > height || this.y < 0) {
        this.speedY = -this.speedY
      }
      if (this.x + containerWidth > width || this.x < 0) {
        this.speedX = -this.speedX
      }

      content.style.left = - this.contentLeft + 'px'
      this.contentLeft += this.speedContentLeft
      if ((this.contentLeft + contentClientWidth) > (contentScrollWidth)) {
        this.contentLeft = contentScrollWidth / 2 - contentClientWidth
      }
    }, 20)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <div ref="container" class="container"
       @mouseenter="stopState = true" @mouseleave="stopState = false">
    <div style="color: red; position: absolute; top: 0; right: 0;" @click="$emit('close')">x</div>
    <h2 ref="content" style="white-space: nowrap; position: relative; left: 0;" @click="jumpTo(bidBidding.id)">
      <span style="white-space: pre;">
        {{ bidBidding.bidTitle }} {{ "      " }} {{ bidBidding.bidTitle }} {{ "      " }}
      </span>
    </h2>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 70px;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  overflow: hidden;
}
</style>
