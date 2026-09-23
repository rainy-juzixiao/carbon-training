<template>
  <el-dialog :title="title" :model-value="open" width="1000px" :close-on-click-modal="false" :show-close="false" @open="handleOpen">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="领料单号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" placeholder="请输入领料单号" clearable  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="领取日期">
        <el-date-picker v-model="daterangeRequisitionDate"  style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary"   @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button  type="warning" plain   @click="cancel">取消</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="requisitionApplyList">
      <el-table-column label="编号" align="center" prop="id"  />
      <el-table-column label="领料单号" align="center" prop="serialNo"  width="200" />
      <el-table-column label="生产计划" align="center" prop="planNo"  width="200" />
      <el-table-column label="产品" align="center" prop="materialName"  width="200" />
      <el-table-column label="型号" prop="materialModel" width="200" >
      </el-table-column>
      <el-table-column label="规格" prop="materialSpecification" width="200" >
      </el-table-column>
      <el-table-column label="单位" prop="materialUnit" width="200" >
      </el-table-column>
      <el-table-column label="领取日期" align="center" prop="requisitionDate"  width="200" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.requisitionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"  width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button   type="text" icon="el-icon-check" @click="handleSelect(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </el-dialog>
</template>

<script>
import { listRequisitionApply } from "@/api/mesProduct/requisitionApply";

export default {
  name: "RequisitionSelect",
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
      default: "选择领料单",
    },
    // 单据状态
    status: {
      type: String,
      default: null,
    }
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
      // 领料申请表格数据
      requisitionApplyList: [],
      // 领取日期时间范围
      daterangeRequisitionDate: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNo: null,
        requisitionDate: null,
        applyUser: null,
        applyTime: null,
        applyStatus: null,
        auditUser: null,
        auditTime: null,
        auditStatus: '1',
        status: this.status,
      },
    };
  },
  created() {
    this.getDicts("receive_material_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    handleOpen() {
      this.getList();
    },
    handleSelect(row) {
      this.$emit('onSelected', row);
    },
    // 取消按钮
    cancel() {
      this.$emit('onCancel')
    },
    /** 查询领料申请列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeRequisitionDate && '' != this.daterangeRequisitionDate) {
        this.queryParams.params["beginRequisitionDate"] = this.daterangeRequisitionDate[0];
        this.queryParams.params["endRequisitionDate"] = this.daterangeRequisitionDate[1];
      }
      listRequisitionApply(this.queryParams).then(response => {
        this.requisitionApplyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeRequisitionDate = [];
      this.daterangeApplyTime = [];
      this.daterangeAuditTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }
};
</script>
