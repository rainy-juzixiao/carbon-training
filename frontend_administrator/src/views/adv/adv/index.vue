<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="广告标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入广告标题"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable filterable >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary"   @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain


          @click="handleAdd"
          v-hasPermi="['adv:adv:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain


          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['adv:adv:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain


          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['adv:adv:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
          v-hasPermi="['adv:adv:export']"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="advList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"/>
      <el-table-column label="主键" align="center" prop="id"  width="200" />
      <el-table-column label="广告标题" align="center" prop="title"  width="200" />
      <el-table-column label="广告图片" align="center" prop="image"  width="200" >
        <template #default="scope">
               <img :src="getBaseUrl()+scope.row.image" min-width="70" height="70"/>
       </template>
      </el-table-column>
      <el-table-column label="业务模块" align="center" prop="servModule"  width="200" />
      <el-table-column label="跳转详情ID" align="center" prop="targetId"  width="200" />
      <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat"  width="200" />
      <el-table-column label="状态" align="center"  width="200" >
         <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort"  width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button

            type="text"

            @click="handleUpdate(scope.row)"
            v-hasPermi="['adv:adv:edit']"
          >修改</el-button>
          <el-button

            type="text"

            @click="handleDelete(scope.row)"
            v-hasPermi="['adv:adv:remove']"
          >删除</el-button>
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

    <!-- 添加或修改广告信息对话框 -->
    <el-dialog :title="title" :model-value="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入广告标题" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="广告图片">
          <imageUpload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="业务模块" prop="servModule">
          <el-input v-model="form.servModule" placeholder="请输入业务模块" />
        </el-form-item>
        <el-form-item label="跳转详情" prop="targetId">
          <el-input v-model="form.targetId" placeholder="请输入跳转详情ID" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
import { listAdv, getAdv, delAdv, addAdv, updateAdv, exportAdv, changeStatus } from "@/api/adv/adv";
import ImageUpload from '@/components/ImageUpload';

export default {
  name: "Adv",
  components: {
    ImageUpload,
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
      // 广告信息表格数据
      advList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型字典
      typeOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        type: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "广告标题不能为空", trigger: "blur" }
        ],
        iamge: [
          { required: true, message: "广告图片不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
          { type: "integer", message: "排序必须为数字", trigger: "change" },
        ],
        type: [
          { required: true, message: "广告类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("adv_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("valid_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询广告信息列表 */
    getList() {
      this.loading = true;
      listAdv(this.queryParams).then(response => {
        this.advList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        title: null,
        image: null,
        servModule: null,
        targetId: null,
        sort: null,
        type: null,
        status: "0",
        createTime: null,
        updateTime: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加广告信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAdv(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改广告信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAdv(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAdv(this.form).then(response => {
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
      this.$confirm('是否确认删除广告信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAdv(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有广告信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAdv(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
        // 广告状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "禁用" : "启用";
      this.$confirm('确认要"' + text + '""' + row.title + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return changeStatus(row.id, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
  }
};
</script>
