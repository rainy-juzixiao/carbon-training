<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据编号" prop="purchasePlanNo">
        <el-input
            v-model="queryParams.purchasePlanNo"
            placeholder="请输入单据编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请时间" prop="applyTime">
        <el-date-picker clearable
                        v-model="queryParams.applyTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择申请时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable>
          <el-option
              v-for="dict in apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditUser">
        <el-input
            v-model="queryParams.auditUser"
            placeholder="请输入审核人"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核日期" prop="auditTime">
        <el-date-picker clearable
                        v-model="queryParams.auditTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择审核日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable>
          <el-option
              v-for="dict in audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核意见" prop="auditComment">
        <el-input
            v-model="queryParams.auditComment"
            placeholder="请输入审核意见"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
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
            v-hasPermi="['purchase:plan:add']"
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
            v-hasPermi="['purchase:plan:edit']"
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
            v-hasPermi="['purchase:plan:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['purchase:plan:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="单据编号" align="center" prop="purchasePlanNo"/>
      <el-table-column label="申请人" align="center" prop="applyUser"/>
      <el-table-column label="申请时间" align="center" prop="applyTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applyStatus">
        <template #default="scope">
          <dict-tag :options="apply_status" :value="scope.row.applyStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="auditUser"/>
      <el-table-column label="审核日期" align="center" prop="auditTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template #default="scope">
          <dict-tag :options="audit_status" :value="scope.row.auditStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" align="center" prop="auditComment"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['purchase:plan:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['purchase:plan:remove']">删除
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

    <!-- 添加或修改采购计划对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据编号" prop="purchasePlanNo">
          <el-input v-model="form.applyUser" placeholder="请输入单据编号"/>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <editor v-model="form.applyUser" :min-height="192"/>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyTime">
          <el-date-picker clearable
                          v-model="form.applyTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择申请时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" placeholder="请选择申请状态">
            <el-option
                v-for="dict in apply_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditUser">
          <el-input v-model="form.auditUser" placeholder="请输入审核人"/>
        </el-form-item>
        <el-form-item label="审核日期" prop="auditTime">
          <el-date-picker clearable
                          v-model="form.auditTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择审核日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态">
            <el-option
                v-for="dict in audit_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditComment">
          <el-input v-model="form.auditComment" placeholder="请输入审核意见"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-divider content-position="center">采购计划详细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddScmPurchasePlanDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteScmPurchasePlanDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="scmPurchasePlanDetailList" :row-class-name="rowScmPurchasePlanDetailIndex"
                  @selection-change="handleScmPurchasePlanDetailSelectionChange" ref="scmPurchasePlanDetail">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料id" prop="materialId" width="300">
            <template #default="scope">
              <el-form-item :prop="'materialId.'+scope.$index+'.materialId'"
                            :rules="rules.materialId">
                <el-input v-model="scope.row.materialId" placeholder="请选择物料id" disabled>
                  <template #append>
                    <el-button v-no-more-click @click="selectMaterialSelectOpen">选择</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" prop="quantity" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.quantity" placeholder="请输入采购数量"/>
            </template>
          </el-table-column>
          <el-table-column label="需求数量" prop="requireQuantity" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.requireQuantity" placeholder="请输入需求数量"/>
            </template>
          </el-table-column>
          <el-table-column label="需求日期" prop="requireDate" width="240">
            <template #default="scope">
              <el-date-picker clearable
                              v-model="scope.row.requireDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择需求日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="detailRemark" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.detailRemark" placeholder="请输入备注"/>
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

<script setup name="Plan">
import {addPlan, delPlan, exportPlan, getPlan, listPlan, updatePlan} from "@/api/purchase/plan";
import {ElMessageBox} from 'element-plus'
import MaterialSelect from "@/components/Material/MaterialSelect";
import {getQueryData} from "@/api/query/comQuery.js";

const {proxy} = getCurrentInstance();

const {apply_status} = proxy.useDict('apply_status')
const {audit_status} = proxy.useDict('audit_status')


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

const planList = ref([]);
const scmPurchasePlanDetailList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedScmPurchasePlanDetail = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    purchasePlanNo: null,
    applyUser: null,
    applyTime: null,
    applyStatus: null,
    auditUser: null,
    auditTime: null,
    auditStatus: null,
    auditComment: null,
  },
  rules: {
    purchasePlanNo: [
      {
        required: true, message: "单据编号不能为空", trigger: "blur"
      }
    ], applyUser: [
      {
        required: true, message: "申请人不能为空", trigger: "blur"
      }
    ], applyTime: [
      {
        required: true, message: "申请时间不能为空", trigger: "blur"
      }
    ], applyStatus: [
      {
        required: true, message: "申请状态不能为空", trigger: "change"
      }
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询采购计划列表 */
function getList() {
  loading.value = true;
  listPlan(queryParams.value).then(response => {
    planList.value = response.rows;
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
    id: null,
    purchasePlanNo: null,
    applyUser: null,
    applyTime: null,
    applyStatus: null,
    auditUser: null,
    auditTime: null,
    auditStatus: null,
    auditComment: null,
    remark: null
  };
  scmPurchasePlanDetailList.value = [];
  proxy.resetForm("planRef");
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
  title.value = "添加采购计划";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPlan(_id).then(response => {
    form.value = response.data;
    scmPurchasePlanDetailList.value = response.data.scmPurchasePlanDetailList;
    open.value = true;
    title.value = "修改采购计划";
  });
}

function submitForm() {

  proxy.$refs["planRef"].validate(valid => {
    if (valid) {
      form.value.scmPurchasePlanDetailList = scmPurchasePlanDetailList.value;
      if (form.value.id != null) {
        updatePlan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPlan(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除采购计划编号为"' + _ids + '"的数据项？').then(function () {
    return delPlan(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 采购计划详细序号 */
function rowScmPurchasePlanDetailIndex({row, rowIndex}) {
  row.index = rowIndex + 1;
}

/** 采购计划详细添加按钮操作 */
function handleAddScmPurchasePlanDetail() {
  let obj = {};
  obj.materialId = "";
  obj.quantity = "";
  obj.requireQuantity = "";
  obj.requireDate = "";
  obj.detailRemark = "";
  scmPurchasePlanDetailList.value.push(obj);
}

/** 采购计划详细删除按钮操作 */
function handleDeleteScmPurchasePlanDetail() {
  if (checkedScmPurchasePlanDetail.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的采购计划详细数据");
  } else {
    const scmPurchasePlanDetails = scmPurchasePlanDetailList.value;
    const checkedScmPurchasePlanDetails = checkedScmPurchasePlanDetail.value;
    scmPurchasePlanDetailList.value = scmPurchasePlanDetails.filter(function (item) {
      return checkedScmPurchasePlanDetails.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleScmPurchasePlanDetailSelectionChange(selection) {
  checkedScmPurchasePlanDetail.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  ElMessageBox.confirm('是否确认导出所有采购计划数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return exportPlan(val).then(res => {
      proxy.download(res.msg);
    });
  })
}

getList();


</script>
