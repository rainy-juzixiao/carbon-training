<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable

          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable filterable >
          
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="供应商" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable

          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="签约日期">
        <el-date-picker
          v-model="daterangeSignDate"

          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary"   @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="materialList">
      <el-table-column label="合同编号" align="center" prop="contractNo"  width="200" />
      <el-table-column label="供应商" align="center" prop="supplierName"  width="200" />
      <el-table-column label="物料名称" align="center" prop="materialName"  width="200" />
      <el-table-column label="型号" align="center" prop="materialModel"  width="200" />
      <el-table-column label="规格" align="center" prop="materialSpecification"  width="200" />
      <el-table-column label="单位" align="center" prop="materialUnit"  width="200" />
      <el-table-column label="单价" align="center" prop="price"  width="200" />
      <el-table-column label="采购数量" align="center" prop="quantity"  width="200" />
      <el-table-column label="金额" align="center" prop="amount"  width="200" />
      <el-table-column label="签约日期" align="center" prop="signDate"  width="200" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listMaterial, exportMaterial} from "@/api/purchaseReport/material";

export default {
  name: "Product",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 采购报表统计表格数据
      materialList: [],
      // 供应商id字典
      supplierIdOptions: [],
      // 签约日期时间范围
      daterangeSignDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialId: null,
        materialName: null,
        supplierId: null,
        supplierName: null,
        contractNo: null,
        signDate: null
      },
    };
  },
  created() {
    this.getList();
    this.getQueryData("query_supplier").then(res => {
      this.supplierIdOptions = res.data;
    });
  },
  methods: {
    /** 查询采购报表统计列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeSignDate && '' != this.daterangeSignDate) {
        this.queryParams.params["beginSignDate"] = this.daterangeSignDate[0];
        this.queryParams.params["endSignDate"] = this.daterangeSignDate[1];
      }
      listMaterial(this.queryParams).then(response => {
        this.materialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 供应商id字典翻译
    supplierIdFormat(row, column) {
      return this.selectDictLabel(this.supplierIdOptions, row.supplierId);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeSignDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
     /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购报表统计数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMaterial(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
