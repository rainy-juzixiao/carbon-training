<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="生产线名称" prop="productLineName">
        <el-input
            v-model="queryParams.productLineName"
            placeholder="请输入生产线名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" >搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['mesModel:factoryModel:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['mesModel:factoryModel:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['mesModel:factoryModel:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['mesModel:factoryModel:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factoryModelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="物料档案编号" align="center" prop="materialId"/>
      <el-table-column label="生产线名称" align="center" prop="productLineName"/>
      <el-table-column label="描述" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['mesModel:factoryModel:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['mesModel:factoryModel:remove']">删除
          </el-button>
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

    <!-- 添加或修改工厂建模对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="factoryModelRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料档案编号" prop="materialId">
          <el-input v-model="form.materialId" placeholder="请选择物料档案编号" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectMaterialSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="生产线名称" prop="productLineName">
          <el-input v-model="form.productLineName" placeholder="请输入生产线名称"/>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述"/>
        </el-form-item>
        <el-divider content-position="center">工厂建模明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddMesFactoryModelDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteMesFactoryModelDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="mesFactoryModelDetailList" :row-class-name="rowMesFactoryModelDetailIndex"
                  @selection-change="handleMesFactoryModelDetailSelectionChange" ref="mesFactoryModelDetail">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="设备编号" prop="equipmentId" width="180">
            <template #default="scope">
              <el-select v-model="scope.row.equipmentId" placeholder="请选择设备编号" clearable>
                <el-option
                    v-for="item in  equipmentIdQuery"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <MaterialSelect :open="MaterialSelectOpen" @onCancel="handleMaterialSelectCancel"
                    @onSelected="handleMaterialSelectSelected">
    </MaterialSelect>
  </div>
</template>

<script setup name="FactoryModel">
import {
  addFactoryModel,
  delFactoryModel,
  exportFactoryModel,
  getFactoryModel,
  listFactoryModel,
  updateFactoryModel
} from "@/api/mesModel/factoryModel";
import {ElMessageBox} from 'element-plus'
import MaterialSelect from "@/components/Material/MaterialSelect";

const {proxy} = getCurrentInstance();


const equipmentIdQuery = ref([])
proxy.getQueryData("query_equipment").then(res => {
  equipmentIdQuery.value = res.data
})
const MaterialSelectOpen = ref(false)
const handleMaterialSelectCancel = () => {
  MaterialSelectOpen.value = false;
}
const selectMaterialSelectOpen = () => {
  MaterialSelectOpen.value = true;
}
const handleMaterialSelectSelected = (row) => {
  MaterialSelectOpen.value = false;
}

const factoryModelList = ref([]);
const mesFactoryModelDetailList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedMesFactoryModelDetail = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialId: null, productLineName: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询工厂建模列表 */
function getList() {
  loading.value = true;
  listFactoryModel(queryParams.value).then(response => {
    factoryModelList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null, materialId: null, productLineName: null, remark: null
  };
  mesFactoryModelDetailList.value = [];
  proxy.resetForm("factoryModelRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加工厂建模";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFactoryModel(_id).then(response => {
    form.value = response.data;
    mesFactoryModelDetailList.value = response.data.mesFactoryModelDetailList;
    open.value = true;
    title.value = "修改工厂建模";
  });
}

function submitForm() {
  proxy.$refs["factoryModelRef"].validate(valid => {
    if (valid) {
      form.value.mesFactoryModelDetailList = mesFactoryModelDetailList.value;
      if (form.value.id != null) {
        updateFactoryModel(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFactoryModel(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除工厂建模编号为"' + _ids + '"的数据项？').then(function () {
    return delFactoryModel(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 工厂建模明细序号 */
function rowMesFactoryModelDetailIndex({row, rowIndex}) {
  row.index = rowIndex + 1;
}

/** 工厂建模明细添加按钮操作 */
function handleAddMesFactoryModelDetail() {
  let obj = {};
  obj.equipmentId = "";
  mesFactoryModelDetailList.value.push(obj);
}

/** 工厂建模明细删除按钮操作 */
function handleDeleteMesFactoryModelDetail() {
  if (checkedMesFactoryModelDetail.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的工厂建模明细数据");
  } else {
    const mesFactoryModelDetails = mesFactoryModelDetailList.value;
    const checkedMesFactoryModelDetails = checkedMesFactoryModelDetail.value;
    mesFactoryModelDetailList.value = mesFactoryModelDetails.filter(function (item) {
      return checkedMesFactoryModelDetails.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleMesFactoryModelDetailSelectionChange(selection) {
  checkedMesFactoryModelDetail.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  ElMessageBox.confirm('是否确认导出所有工厂建模数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return exportFactoryModel(val).then(res => {
      proxy.download(res.msg);
    });
  })
}

getList();


</script>
