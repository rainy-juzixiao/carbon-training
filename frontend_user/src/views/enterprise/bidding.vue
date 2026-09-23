<template>
  <div>根据题目要求选手自行编写。</div>
</template>

<script>

</script>

<style scoped>
.content {
  background: #FFFFFF;
  border-radius: 10px;
  width: 90%;
  padding: 20px;
  margin-left: 20px;
}

@media screen and (max-width: 540px) {
  .content {
    margin-left: 15px;
    padding: 10px;
  }
}

:deep(.pagination-container){
  margin: 0;
}

:deep(.el-pagination){
  float: right;
}

</style>
