<template>
  <el-dialog :title="title" :model-value="open" width="1000px" :close-on-click-modal="false" :show-close="false"
    append-to-body>
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="检验项目" prop="checkItemName">
        <el-input v-model="queryParams.checkItemName" placeholder="请输入检验项目名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="检验类型" prop="checkType">
        <el-select v-model="queryParams.checkType" placeholder="请选择检验类型" clearable filterable >
          <el-option v-for="dict in checkTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button  type="primary"   @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col v-if="!isSingle" :span="1.5">
        <el-button  type="primary" plain icon="el-icon-check" :disabled="multiple"  @click="handleSelect">选择
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button  type="warning" plain   @click="cancel">取消</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="standardList" @selection-change="handleSelectionChange">
      <el-table-column v-if="!isSingle" type="selection"  align="center"  width="200" />
      <el-table-column label="编号" align="center" prop="id"  />
      <el-table-column label="物料名称" align="center" prop="materialName"  width="200" />
      <el-table-column label="检验项目" align="center" prop="checkItemName"  width="200" />
      <el-table-column label="检验类型" align="center" prop="checkType" :formatter="checkTypeFormat"  width="200" />
      <el-table-column label="标准值上限" align="center" prop="maxValue"  width="200" />
      <el-table-column label="标准值下限" align="center" prop="minValue"  width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button   type="text" icon="el-icon-check" @click="handleSelect(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </el-dialog>
</template>

<script>
  import {
    listStandard,
  } from "@/api/mesCheck/standard";
  export default {
    name: "StandardSelect",
    components: {

    },
    props: {
      open: {
        type: Boolean,
        default: false,
      },
      // 弹出层标题
      title: {
        type: String,
        default: "选择检验标准",
      },
      //是否单选
      isSingle: {
        type: Boolean,
        default: true,
      },
      // 物料id
      materialId: {
        type: Number,
        default: null,
      },
      // 物料id
      checkType: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 标准表格数据
        standardList: [],
        // 检验类型：1来料检验2产品检验3生产采样字典
        checkTypeOptions: [],
        selectedList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          materialId: null,
          materialName: null,
          checkItemName: null,
          checkType: null,
        },
      };
    },
    created() {
      this.queryParams.materialId = this.materialId
      this.queryParams.checkType = this.checkType
      this.getDicts("mes_check_type").then(response => {
        this.checkTypeOptions = response.data;
      });
      this.getList();
    },
    watch: {
      materialId(newVal, oldVal) {
        if (newVal) {
          console.log(newVal)
          this.queryParams.materialId = this.materialId;
          this.getList();
        }
      }
    },
    methods: {
      handleSelect(row) {
        if (row) {
          this.selectedList = [];
          this.selectedList.push(row);
        }
        this.$emit('onStandardSelected', this.selectedList);
      },
      /** 查询列表 */
      getList() {
        this.loading = true;
        listStandard(this.queryParams).then(response => {
          this.standardList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 检验类型字典翻译
      checkTypeFormat(row, column) {
        return this.selectDictLabel(this.checkTypeOptions, row.checkType);
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.selectedList = [];
        this.selectedList.push(selection);
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      cancel() {
        this.selectedList = [];
        this.$emit('onStandardCancel')
      }
    }
  };

</script>
