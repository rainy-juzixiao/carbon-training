<template>
  <div>根据题目要求选手自行编写。</div>
</template>

<script>

</script>

<style lang="scss" scoped>
.detail {
  .breadcrumb {
    height: 21px;
    font-family: MicrosoftYaHei, sans-serif;
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    letter-spacing: 0em;
    margin-left: 30px
  }

  .content {
    margin: 14px 30px 44px 30px;
    background: #FFFFFF;
    border-radius: 10px;
    opacity: 1;
    min-height: 860px;
    display: flex;
    flex-direction: column;

    .title {
      font-family: MicrosoftYaHei, sans-serif;
      height: 35px;
      opacity: 1;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 0em;
      color: #3D3D3D;
      margin-top: 24px;
    }

    .publish {
      font-family: MicrosoftYaHei, sans-serif;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      letter-spacing: 0em;
      color: #333333;
      margin-top: 30px;

      &:nth-child(n + 1) {
        font-family: MicrosoftYaHei, sans-serif;
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0em;
        /* 次强调正文标题 */
        color: #333333;
      }

      &:nth-child(n + 2) {
        font-family: MicrosoftYaHei, sans-serif;
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0em;
        /* 次强调正文标题 */
        color: #666666;
      }
    }
  }

  .bidContent {
    min-height: 575.34px;
    text-align: left;
    margin: 20px 44px 0 36px;
  }

  .download {
    display: flex;
    margin: 30px 0px 30px 46px;

    ul {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      li {
        margin: 20px 0 0 20px;
        list-style: none;
        font-family: MicrosoftYaHei, serif;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: MicrosoftYaHei, serif;
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0em;

        color: #3D3D3D;

        .content {
          width: 540px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .datetime {

        }
      }

      li:hover {
        color: #13B69F;
        cursor: pointer;
      }
    }
  }

}

</style>
