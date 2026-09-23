<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入编码" clearable  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="仓库名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入仓库名" clearable  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button  type="primary"   @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button  type="primary" plain    v-hasPermi="['warehouse:warehouseInfo:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button  type="success" plain    @click="handleUpdate" v-hasPermi="['warehouse:warehouseInfo:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button  type="danger" plain   :disabled="multiple" @click="handleDelete" v-hasPermi="['warehouse:warehouseInfo:remove']">删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="warehouseInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"/>
      <el-table-column label="编号" align="center" prop="id"  />
      <el-table-column label="编码" align="center" prop="code"  width="200" />
      <el-table-column label="仓库名" align="center" prop="name"  width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button   type="text"  @click="handleRegion(scope.row)" v-hasPermi="['warehouse:warehouseRegion:query']">库区</el-button>
          <el-button   type="text"  @click="handleUpdate(scope.row)" v-hasPermi="['warehouse:warehouseInfo:edit']">修改</el-button>
          <el-button   type="text"  @click="handleDelete(scope.row)" v-hasPermi="['warehouse:warehouseInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改仓库管理对话框 -->
    <el-dialog :title="title" :model-value="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="仓库名" prop="name">
          <el-input v-model="form.name" placeholder="请输入仓库名" />
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button  type="primary" @click="submitForm">确 定</el-button>
        <el-button  @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouseInfo, getWarehouseInfo, delWarehouseInfo, addWarehouseInfo, updateWarehouseInfo, exportWarehouseInfo } from "@/api/warehouse/warehouseInfo";

export default {
  name: "WarehouseInfo",
  components: {
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
      // 仓库管理表格数据
      warehouseInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        name: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code:[
          { max: 10, message: "编码最多10个字符", trigger: "blur" }
        ],
        name:[
          { max: 20, message: "仓库名最多20个字符", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleRegion(row) {
      this.$router.push({
        path: "/wms/warehouseRegion",
        query: { id: row.id },
      });
    },
    /** 查询仓库管理列表 */
    getList() {
      this.loading = true;
      listWarehouseInfo(this.queryParams).then(response => {
        this.warehouseInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        name: null
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加仓库管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWarehouseInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改仓库管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWarehouseInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehouseInfo(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除仓库管理编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delWarehouseInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有仓库管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportWarehouseInfo(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
