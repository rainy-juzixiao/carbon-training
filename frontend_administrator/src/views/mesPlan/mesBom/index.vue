<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="供应商等级" prop="level">
        <el-select v-model="queryParams.level" placeholder="请选择供应商等级" clearable>
          <el-option
              v-for="dict in scm_supplier_level"
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
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker clearable
                        v-model="queryParams.auditTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择审核时间">
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
            v-hasPermi="['purchase:supplier:add']"
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
            v-hasPermi="['purchase:supplier:edit']"
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
            v-hasPermi="['purchase:supplier:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['purchase:supplier:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="供应商编号" align="center" prop="supplierNo"/>
      <el-table-column label="供应商名称" align="center" prop="name"/>
      <el-table-column label="简称" align="center" prop="shortName"/>
      <el-table-column label="地址" align="center" prop="addr"/>
      <el-table-column label="电话" align="center" prop="tel"/>
      <el-table-column label="开户银行" align="center" prop="bank"/>
      <el-table-column label="银行账号" align="center" prop="account"/>
      <el-table-column label="税号" align="center" prop="taxNo"/>
      <el-table-column label="联系人" align="center" prop="contact"/>
      <el-table-column label="联系电话" align="center" prop="contactTel"/>
      <el-table-column label="供应商分类" align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="scm_supplier_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="供应商等级" align="center" prop="level">
        <template #default="scope">
          <dict-tag :options="scm_supplier_level" :value="scope.row.level"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_status_test" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applyUser"/>
      <el-table-column label="申请时间" align="center" prop="applyTime"/>
      <el-table-column label="申请状态" align="center" prop="applyStatus">
        <template #default="scope">
          <dict-tag :options="apply_status" :value="scope.row.applyStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="auditUser"/>
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
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
                     v-hasPermi="['purchase:supplier:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['purchase:supplier:remove']">删除
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

    <!-- 添加或修改供应商对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="supplierRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="供应商编号" prop="supplierNo">
          <el-input v-model="form.supplierNo" placeholder="请选择供应商编号" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectDeliverySelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="form.name" placeholder="请选择供应商名称" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectMaterialDetailInventorySelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请选择简称" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectMaterialInventorySelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请选择地址" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectSelectCarrierBillOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请选择电话" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectSelectDispatchBillOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank">
          <el-input v-model="form.bank" placeholder="请选择开户银行" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectPlanSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="account">
          <el-input v-model="form.account" placeholder="请选择银行账号" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectApplySelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="税号" prop="taxNo">
          <el-input v-model="form.taxNo" placeholder="请选择税号" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectContractSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请选择联系人" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectArriveSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactTel">
          <el-input v-model="form.contactTel" placeholder="请选择联系电话" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectCustomerSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商分类" prop="type">
          <el-input v-model="form.type" placeholder="请选择供应商分类" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectOrderSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择供应商等级">
            <el-option
                v-for="dict in scm_supplier_level"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" placeholder="请选择状态" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectProductPlanSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <el-input v-model="form.applyUser" placeholder="请选择申请人" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectProductScheduleSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyTime">
          <el-input v-model="form.applyTime" placeholder="请选择申请时间" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectProductJobSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-input v-model="form.applyStatus" placeholder="请选择申请状态" disabled>
            <template #append>
              <el-button v-no-more-click @click="selectRequisitionSelectOpen()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="审核人" prop="auditUser">
          <el-input v-model="form.auditUser" placeholder="请输入审核人"/>
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker clearable
                          v-model="form.auditTime"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择审核时间">
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
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <DeliverySelect :open="DeliverySelectOpen" @onCancel="handleDeliverySelectCancel"
                    @onSelected="handleDeliverySelectSelected">
    </DeliverySelect>
    <MaterialDetailInventorySelect :open="MaterialDetailInventorySelectOpen"
                                   @onCancel="handleMaterialDetailInventorySelectCancel"
                                   @onSelected="handleMaterialDetailInventorySelectSelected">
    </MaterialDetailInventorySelect>
    <MaterialInventorySelect :open="MaterialInventorySelectOpen" @onCancel="handleMaterialInventorySelectCancel"
                             @onSelected="handleMaterialInventorySelectSelected">
    </MaterialInventorySelect>
    <SelectCarrierBill :open="SelectCarrierBillOpen" @onCancel="handleSelectCarrierBillCancel"
                       @onSelected="handleSelectCarrierBillSelected">
    </SelectCarrierBill>
    <SelectDispatchBill :open="SelectDispatchBillOpen" @onCancel="handleSelectDispatchBillCancel"
                        @onSelected="handleSelectDispatchBillSelected">
    </SelectDispatchBill>
    <PlanSelect :open="PlanSelectOpen" @onCancel="handlePlanSelectCancel"
                @onSelected="handlePlanSelectSelected">
    </PlanSelect>
    <ApplySelect :open="ApplySelectOpen" @onCancel="handleApplySelectCancel"
                 @onSelected="handleApplySelectSelected">
    </ApplySelect>
    <ContractSelect :open="ContractSelectOpen" @onCancel="handleContractSelectCancel"
                    @onSelected="handleContractSelectSelected">
    </ContractSelect>
    <ArriveSelect :open="ArriveSelectOpen" @onCancel="handleArriveSelectCancel"
                  @onSelected="handleArriveSelectSelected">
    </ArriveSelect>
    <CustomerSelect :open="CustomerSelectOpen" @onCancel="handleCustomerSelectCancel"
                    @onSelected="handleCustomerSelectSelected">
    </CustomerSelect>
    <OrderSelect :open="OrderSelectOpen" @onCancel="handleOrderSelectCancel"
                 @onSelected="handleOrderSelectSelected">
    </OrderSelect>
    <ProductPlanSelect :open="ProductPlanSelectOpen" @onCancel="handleProductPlanSelectCancel"
                       @onSelected="handleProductPlanSelectSelected">
    </ProductPlanSelect>
    <ProductScheduleSelect :open="ProductScheduleSelectOpen" @onCancel="handleProductScheduleSelectCancel"
                           @onSelected="handleProductScheduleSelectSelected">
    </ProductScheduleSelect>
    <ProductJobSelect :open="ProductJobSelectOpen" @onCancel="handleProductJobSelectCancel"
                      @onSelected="handleProductJobSelectSelected">
    </ProductJobSelect>
    <RequisitionSelect :open="RequisitionSelectOpen" @onCancel="handleRequisitionSelectCancel"
                       @onSelected="handleRequisitionSelectSelected">
    </RequisitionSelect>
  </div>
</template>

<script setup name="Supplier">
import {
  addSupplier,
  delSupplier,
  exportSupplier,
  getSupplier,
  listSupplier,
  updateSupplier
} from "@/api/purchase/supplier";
import {ElMessageBox} from 'element-plus'
import DeliverySelect from "@/components/Sale/DeliverySelect"
import MaterialDetailInventorySelect from '@/components/Material/MaterialDetailInventorySelect.vue';
import MaterialInventorySelect from "@/components/Material/MaterialInventorySelect.vue";
import SelectCarrierBill from "@/components/transportApply/SelectCarrierBill.vue";
import SelectDispatchBill from "@/components/transportApply/SelectDispatchBill.vue";
import PlanSelect from "@/components/Purchase/PlanSelect";
import ApplySelect from "@/components/Purchase/ApplySelect";
import ContractSelect from "@/components/Purchase/ContractSelect";
import ArriveSelect from "@/components/Purchase/ArriveSelect";
import CustomerSelect from "@/components/Sale/CustomerSelect";
import OrderSelect from '@/components/Sale/OrderSelect.vue';
import ProductPlanSelect from '@/components/product/ProductPlanSelect.vue';
import ProductScheduleSelect from '@/components/product/ProductScheduleSelect.vue';
import ProductJobSelect from "@/components/product/ProductJobSelect";
import RequisitionSelect from "@/components/product/RequisitionSelect";

const {proxy} = getCurrentInstance();

const {scm_supplier_type} = proxy.useDict('scm_supplier_type')
const {scm_supplier_level} = proxy.useDict('scm_supplier_level')
const {sys_status_test} = proxy.useDict('sys_status_test')
const {apply_status} = proxy.useDict('apply_status')
const {audit_status} = proxy.useDict('audit_status')


const DeliverySelectOpen = ref(false)
const handleDeliverySelectCancel = () => {
  DeliverySelectOpen.value = false;
}
const selectDeliverySelectOpen = () => {
  DeliverySelectOpen.value = true;
}
const handleDeliverySelectSelected = (row) => {
  DeliverySelectOpen.value = false;
}
const MaterialDetailInventorySelectOpen = ref(false)
const handleMaterialDetailInventorySelectCancel = () => {
  MaterialDetailInventorySelectOpen.value = false;
}
const selectMaterialDetailInventorySelectOpen = () => {
  MaterialDetailInventorySelectOpen.value = true;
}
const handleMaterialDetailInventorySelectSelected = (row) => {
  MaterialDetailInventorySelectOpen.value = false;
}
const MaterialInventorySelectOpen = ref(false)
const handleMaterialInventorySelectCancel = () => {
  MaterialInventorySelectOpen.value = false;
}
const selectMaterialInventorySelectOpen = () => {
  MaterialInventorySelectOpen.value = true;
}
const handleMaterialInventorySelectSelected = (row) => {
  MaterialInventorySelectOpen.value = false;
}
const SelectCarrierBillOpen = ref(false)
const handleSelectCarrierBillCancel = () => {
  SelectCarrierBillOpen.value = false;
}
const selectSelectCarrierBillOpen = () => {
  SelectCarrierBillOpen.value = true;
}
const handleSelectCarrierBillSelected = (row) => {
  SelectCarrierBillOpen.value = false;
}
const SelectDispatchBillOpen = ref(false)
const handleSelectDispatchBillCancel = () => {
  SelectDispatchBillOpen.value = false;
}
const selectSelectDispatchBillOpen = () => {
  SelectDispatchBillOpen.value = true;
}
const handleSelectDispatchBillSelected = (row) => {
  SelectDispatchBillOpen.value = false;
}
const PlanSelectOpen = ref(false)
const handlePlanSelectCancel = () => {
  PlanSelectOpen.value = false;
}
const selectPlanSelectOpen = () => {
  PlanSelectOpen.value = true;
}
const handlePlanSelectSelected = (row) => {
  PlanSelectOpen.value = false;
}
const ApplySelectOpen = ref(false)
const handleApplySelectCancel = () => {
  ApplySelectOpen.value = false;
}
const selectApplySelectOpen = () => {
  ApplySelectOpen.value = true;
}
const handleApplySelectSelected = (row) => {
  ApplySelectOpen.value = false;
}
const ContractSelectOpen = ref(false)
const handleContractSelectCancel = () => {
  ContractSelectOpen.value = false;
}
const selectContractSelectOpen = () => {
  ContractSelectOpen.value = true;
}
const handleContractSelectSelected = (row) => {
  ContractSelectOpen.value = false;
}
const ArriveSelectOpen = ref(false)
const handleArriveSelectCancel = () => {
  ArriveSelectOpen.value = false;
}
const selectArriveSelectOpen = () => {
  ArriveSelectOpen.value = true;
}
const handleArriveSelectSelected = (row) => {
  ArriveSelectOpen.value = false;
}
const CustomerSelectOpen = ref(false)
const handleCustomerSelectCancel = () => {
  CustomerSelectOpen.value = false;
}
const selectCustomerSelectOpen = () => {
  CustomerSelectOpen.value = true;
}
const handleCustomerSelectSelected = (row) => {
  CustomerSelectOpen.value = false;
}
const OrderSelectOpen = ref(false)
const handleOrderSelectCancel = () => {
  OrderSelectOpen.value = false;
}
const selectOrderSelectOpen = () => {
  OrderSelectOpen.value = true;
}
const handleOrderSelectSelected = (row) => {
  OrderSelectOpen.value = false;
}
const ProductPlanSelectOpen = ref(false)
const handleProductPlanSelectCancel = () => {
  ProductPlanSelectOpen.value = false;
}
const selectProductPlanSelectOpen = () => {
  ProductPlanSelectOpen.value = true;
}
const handleProductPlanSelectSelected = (row) => {
  ProductPlanSelectOpen.value = false;
}
const ProductScheduleSelectOpen = ref(false)
const handleProductScheduleSelectCancel = () => {
  ProductScheduleSelectOpen.value = false;
}
const selectProductScheduleSelectOpen = () => {
  ProductScheduleSelectOpen.value = true;
}
const handleProductScheduleSelectSelected = (row) => {
  ProductScheduleSelectOpen.value = false;
}
const ProductJobSelectOpen = ref(false)
const handleProductJobSelectCancel = () => {
  ProductJobSelectOpen.value = false;
}
const selectProductJobSelectOpen = () => {
  ProductJobSelectOpen.value = true;
}
const handleProductJobSelectSelected = (row) => {
  ProductJobSelectOpen.value = false;
}
const RequisitionSelectOpen = ref(false)
const handleRequisitionSelectCancel = () => {
  RequisitionSelectOpen.value = false;
}
const selectRequisitionSelectOpen = () => {
  RequisitionSelectOpen.value = true;
}
const handleRequisitionSelectSelected = (row) => {
  RequisitionSelectOpen.value = false;
}

const supplierList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    supplierNo: null,
    name: null,
    shortName: null,
    addr: null,
    tel: null,
    bank: null,
    account: null,
    taxNo: null,
    contact: null,
    contactTel: null,
    type: null,
    level: null,
    status: null,
    applyUser: null,
    applyTime: null,
    applyStatus: null,
    auditUser: null,
    auditTime: null,
    auditStatus: null,
    auditComment: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询供应商列表 */
function getList() {
  loading.value = true;
  listSupplier(queryParams.value).then(response => {
    supplierList.value = response.rows;
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
    supplierNo: null,
    name: null,
    shortName: null,
    addr: null,
    tel: null,
    bank: null,
    account: null,
    taxNo: null,
    contact: null,
    contactTel: null,
    type: null,
    level: null,
    status: null,
    applyUser: null,
    applyTime: null,
    applyStatus: null,
    auditUser: null,
    auditTime: null,
    auditStatus: null,
    auditComment: null,
    remark: null
  };
  proxy.resetForm("supplierRef");
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
  title.value = "添加供应商";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getSupplier(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改供应商";
  });
}

function submitForm() {
  proxy.$refs["supplierRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSupplier(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSupplier(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除供应商编号为"' + _ids + '"的数据项？').then(function () {
    return delSupplier(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  ElMessageBox.confirm('是否确认导出所有供应商数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return exportSupplier(val).then(res => {
      proxy.download(res.msg);
    });
  })
}

getList();


</script>
