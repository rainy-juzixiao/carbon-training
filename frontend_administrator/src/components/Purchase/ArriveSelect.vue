<template>
  <el-dialog :title="title" :model-value="open" width="1000px" :close-on-click-modal="false" :show-close="false"
    append-to-body>
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="到货单号" prop="arriveNo">
        <el-input v-model="queryParams.arriveNo" placeholder="请输入到货单号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNo">
        <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-input v-model="queryParams.supplierName" placeholder="请输入供应商" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
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

    <el-table v-loading="loading" :data="arriveList" @selection-change="handleSelectionChange">
      <el-table-column v-if="!isSingle" type="selection"  align="center"  width="200" />
      <el-table-column label="编号" align="center" prop="id"  />
      <el-table-column label="到货单号" align="center" prop="arriveNo"  width="200" />
      <el-table-column label="合同编号" align="center" prop="contractNo"  width="200" />
      <el-table-column label="供应商名称" align="center" prop="supplierName"  width="200" />
      <el-table-column label="联系人" align="center" prop="contact"  width="200" />
      <el-table-column label="联系电话" align="center" prop="contactTel"  width="200" />
      <el-table-column label="到货日期" align="center" prop="arriveDate"  width="200" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.arriveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"  width="200" />
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
    listArrive
  } from "@/api/purchase/arrive";
  export default {
    name: "ArriveSelect",
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
        default: "选择到货单",
      },
      //是否单选
      isSingle: {
        type: Boolean,
        default: true,
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
        // 表格数据
        arriveList: [],
        selectedList: [],
        // 类型字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          contractNo: null,
          auditTime: null,
          supplierName: null,
          status: '0', //未入库
          orderByColumn: 'create_time',
          isAsc: 'desc',
        }
      };
    },
    created() {
      this.getDicts("scm_in_warehouse_status").then(response => {
        this.statusOptions = response.data;
      });
      this.getList();
    },
    methods: {
      handleSelect(row) {
        if (row) {
          this.selectedList = [];
          this.selectedList.push(row);
        }
        this.$emit('onSelected', this.selectedList);
      },

      // 状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },

      /** 查询列表 */
      getList() {
        this.loading = true;
        listArrive(this.queryParams).then(response => {
          this.arriveList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
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
        this.$emit('onSelected')
      }
    }
  };

</script>
