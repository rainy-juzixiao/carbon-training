<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入分类编码" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['material:materialCategory:add']">新增
        </el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="materialCategoryList" row-key="id" default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="分类编码" align="center" prop="code" width="200"/>
      <el-table-column label="分类名称" align="center" prop="name" width="200"/>
      <el-table-column label="说明" align="center" prop="remark" width="200"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template #default="scope">
          <el-button type="text" @click="handleAdd(scope.row)" v-hasPermi="['system:materialCategory:add']">新增
          </el-button>
          <el-button type="text" @click="handleUpdate(scope.row)" v-hasPermi="['material:materialCategory:edit']">修改
          </el-button>
          <el-button type="text" @click="handleDelete(scope.row)" v-hasPermi="['material:materialCategory:remove']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改物料分类对话框 -->
    <el-dialog :title="title" :model-value="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级分类" prop="parentId">
          <treeselect v-model="form.parentId" :options="materialCategoryOptions" :normalizer="normalizer"
                      placeholder="请选择父级分类编号"/>

          <el-tree-select
              v-model="form.parentId"
              :data="materialCategoryOptions"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              value-key="id"
              placeholder="选择"
              check-strictly
          />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码"/>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <template slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  addMaterialCategory,
  delMaterialCategory,
  getMaterialCategory,
  listMaterialCategory,
  updateMaterialCategory
} from "@/api/material/materialCategory";

export default {
  name: "MaterialCategory",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 物料分类表格数据
      materialCategoryList: [],
      // 物料分类树选项
      materialCategoryOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        code: null,
        parentId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          {max: 10, message: "分类编码最多10个字符", trigger: "blur"}
        ],
        name: [
          {max: 20, message: "分类名称最多20个字符", trigger: "blur"}
        ],
        remark: [
          {max: 20, message: "说明最多20个字符", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询物料分类列表 */
    getList() {
      this.loading = true;
      listMaterialCategory(this.queryParams).then(response => {
        this.materialCategoryList = this.handleTree(response.rows, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换物料分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 查询下拉树结构 */
    getTreeselect() {
      listMaterialCategory().then(response => {
        this.materialCategoryOptions = [];
        const data = {id: 0, name: '顶级节点', children: []};
        data.children = this.handleTree(response.rows, "id", "parentId");
        this.materialCategoryOptions.push(data);
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
        name: null,
        remark: null,
        parentId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      this.getTreeselect();
      this.open = true;
      this.title = "添加物料分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getMaterialCategory(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改物料分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMaterialCategory(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialCategory(this.form).then(response => {
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
      this.$confirm('是否确认删除物料分类编号为"' + row.id + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delMaterialCategory(row.id);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    }
  }
};
</script>
