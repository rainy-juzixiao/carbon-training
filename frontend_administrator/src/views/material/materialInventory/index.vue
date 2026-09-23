<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="型号" prop="materialModel">
        <el-input v-model="queryParams.materialModel" placeholder="请输入物料型号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="规格" prop="materialSpecification">
        <el-input v-model="queryParams.materialSpecification" placeholder="请输入物料规格" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['material:materialInventory:add']">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain :disabled="single" @click="handleUpdate"
                   v-hasPermi="['material:materialInventory:edit']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['material:materialInventory:remove']">删除
        </el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :row-class-name="tableRowClassName" :data="materialInventoryList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="仓库" align="center" prop="warehouseId" :formatter="warehouseIdFormat" width="200"/>
      <el-table-column label="物料编号" align="center" prop="materialCode" width="200"/>
      <el-table-column label="物料名称" align="center" prop="materialName" width="200"/>
      <el-table-column label="物料型号" align="center" prop="materialModel" width="200"/>
      <el-table-column label="物料规格" align="center" prop="materialSpecification" width="200"/>
      <el-table-column label="物料单位" align="center" prop="materialUnit" width="200"/>
      <el-table-column label="物料单价" align="center" prop="materialPrice" width="200"/>
      <el-table-column label="总库存" align="center" prop="totalInventory" width="200"/>
      <el-table-column label="锁定库存" align="center" prop="freezeInventory" width="200"/>
      <el-table-column label="库存上限" align="center" prop="maxInventory" width="200"/>
      <el-table-column label="库存下限" align="center" prop="minInventory" width="200"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template #default="scope">
          <el-button type="text" icon="el-icon-shopping-cart-full" @click="handleMove(scope.row)"
                     v-hasPermi="['material:materialInventory:edit']">移库
          </el-button>
          <el-button type="text" @click="handleUpdate(scope.row)"
                     v-hasPermi="['material:materialInventory:edit']">修改
          </el-button>
          <el-button type="text" @click="handleDelete(scope.row)"
                     v-hasPermi="['material:materialInventory:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 添加或修改仓库物料信息对话框 -->
    <el-dialog :title="title" :model-value="open" width="1000px" append-to-body>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请选择物料" disabled>
            <template #append>
                <el-button slot="append" @click="handleSelectMaterial">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId" placeholder="请选择仓库" clearable filterable
                     @change="handleWarehouseChange">
            <el-option v-for="dict in warehouseIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="物料型号" prop="materialModel">
          <el-input v-model="form.materialModel" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="物料规格" prop="materialSpecification">
          <el-input v-model="form.materialSpecification" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="物料单位" prop="materialUnit">
          <el-input v-model="form.materialUnit" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="总库存" prop="totalInventory">
          <el-input v-model="form.totalInventory" disabled/>
        </el-form-item>
        <el-form-item label="锁定库存" prop="freezeInventory">
          <el-input v-model="form.freezeInventory" disabled/>
        </el-form-item>
        <el-form-item label="库存上限" prop="maxInventory">
          <el-input v-model.number="form.maxInventory" placeholder="请输入库存上限"/>
        </el-form-item>
        <el-form-item label="库存下限" prop="minInventory">
          <el-input v-model.number="form.minInventory" placeholder="请输入库存下限"/>
        </el-form-item>
        <el-divider content-position="center">仓库物料明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAddWmsWarehouseMaterialDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" @click="handleDeleteWmsWarehouseMaterialDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="wmsWarehouseMaterialDetailList" :row-class-name="rowWmsWarehouseMaterialDetailIndex"
                  @selection-change="handleWmsWarehouseMaterialDetailSelectionChange" ref="wmsWarehouseMaterialDetail">
          <el-table-column type="selection"  align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="200"/>
          <el-table-column label="库区" prop="whRegionId" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.whRegionId'"
                            :rules="rules.whRegionId">
                <el-select v-model="scope.row.whRegionId" placeholder="请选择库区" filterable
                           @change="handleWhRegionChange(scope.row.whRegionId,scope.$index)">
                  <el-option v-for="dict in scope.row.whRegionOptions" :key="dict.id" :label="dict.name"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="whLocationId" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.whLocationId'"
                            :rules="rules.whLocationId">
                <el-select v-model="scope.row.whLocationId" placeholder="请选择库位" filterable>
                  <el-option v-for="dict in scope.row.whLocationOptions" :key="dict.id" :label="dict.name"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="现有库存" prop="inventory" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.inventory'"
                            :rules="rules.inventory">
                <el-input v-model.number="scope.row.inventory" placeholder="请输入库存量"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="锁定库存" prop="lockInventory" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.lockInventory'">
                <el-input v-model.number="scope.row.lockInventory" placeholder="" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="物料名" prop="materialName" width="200">
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="200">
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecification" width="200">
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="200">
          </el-table-column>
          <el-table-column label="生产日期" prop="productDate" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.productDate'">
                <el-date-picker clearable v-model="scope.row.productDate" type="date" value-format="yyyy-MM-dd"
                                placeholder="请选择生产日期"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产厂家" prop="manufacturer" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.manufacturer'">
                <el-input v-model="scope.row.manufacturer" placeholder="请输入生产厂家"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNo" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.batchNo'" :rules="rules.batchNo">
                <el-input v-model="scope.row.batchNo" placeholder="请输入生产批号"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehouseMaterialDetailList.'+scope.$index+'.remark'">
                <el-input v-model="scope.row.remark" placeholder="请输入备注"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
            <template #default="scope">
              <el-button type="text" @click="handleTag(scope.row)"
                         v-hasPermi="['material:materialInventoryDetail:edit']">标签
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
    <!--选择物料档案-->
    <MaterialSelect :open="materialSelectOpen" @onCancel="handleMaterialCancel"
                    @onSelected="handleMaterialSelected"></MaterialSelect>
    <move :open="moveOpen" :billId="inventoryId" @onCancel="handleCancel"></move>
    <TagView :open="tagOpen" :material="tagMaterial" @onCancel="handleTagCancel"></TagView>
  </div>
</template>

<script>
import {
  addMaterialInventory,
  delMaterialInventory,
  exportMaterialInventory,
  getMaterialInventory,
  listMaterialInventory,
  updateMaterialInventory
} from "@/api/material/materialInventory";
import {listWarehouseRegion} from "@/api/warehouse/warehouseRegion";
import {listWarehouseLocation} from "@/api/warehouse/warehouseLocation";
import MaterialSelect from "@/components/Material/MaterialSelect";
import Move from "./move";
import TagView from "../materialTag/view.vue";

export default {
  name: "MaterialInventory",
  components: {
    MaterialSelect,
    Move,
    TagView
  },
  data() {
    return {
      material: null,
      inventoryId: null,
      tagMaterial: null,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsWarehouseMaterialDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 仓库物料信息表格数据
      materialInventoryList: [],
      // 仓库物料明细表格数据
      wmsWarehouseMaterialDetailList: [],
      // 仓库字典
      warehouseIdOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      moveOpen: false,
      materialSelectOpen: false,
      tagOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseName: null,
        materialName: null,
        materialSpecification: null,
        materialModel: null,
        totalInventory: null,
        freezeInventory: null,
        maxInventory: null,
        minInventory: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        materialName: [
          {required: true, message: "物料名称不能为空", trigger: "blur"}
        ],
        warehouseId: [
          {required: true, message: "仓库不能为空", trigger: "blur"}
        ],
        whRegionId: [
          {required: true, message: "库区不能为空", trigger: "blur"}
        ],
        whLocationId: [
          {required: true, message: "库位不能为空", trigger: "blur"}
        ],
        inventory: [
          {required: true, message: "库存不能为空", trigger: "blur"},
          {type: 'number', min: 0, max: 65535, message: '库存必须为数字值且大小要在1到65535'},
        ],
        batchNo: [
          {required: true, message: "生产批号不能为空", trigger: "blur"}
        ],
        maxInventory: [
          {type: 'number', min: 0, max: 99999999, message: '必须为数字值且大小要在1到99999999'},
        ],
        minInventory: [
          {type: 'number', min: 0, max: 99999999, message: '必须为数字值且大小要在1到99999999'},
        ],
        manufacturer: [
          {max: 40, message: "生产厂家最多40个字符", trigger: "blur"}
        ],
        batchNo: [
          {max: 20, message: "生产批号最多10个字符", trigger: "blur"}
        ],
        remark: [
          {max: 100, message: "备注最多100个字符", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getQueryData("query_warehouse").then(res => {
      this.warehouseIdOptions = res.data;
    });
  },
  watch: {
    'wmsWarehouseMaterialDetailList': {
      handler(newVal, oldVal) {
        this.form.wmsWarehouseMaterialDetailList = newVal;
        this.calculateInventory();
      },
      immediate: true,
      deep: true,
    },
    'material': {
      handler(newVal, oldVal) {
        this.setInventoryDetail();
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.minInventory) {
        if (row.totalInventory < row.minInventory) {
          return 'lower';
        }
      }
      if (row.maxInventory) {
        if (row.totalInventory > row.maxInventory) {
          return 'upper';
        }
      }
      return '';
    },
    handleTag(row) {
      this.tagMaterial = row;
      this.tagOpen = true;
    },
    handleTagCancel() {
      this.tagOpen = false;
    },
    handleCancel() {
      this.moveOpen = false;
      this.getList();
    },
    //移库
    handleMove(row) {
      this.inventoryId = row.id;
      this.moveOpen = true;
    },
    //计算总库存和锁定库存
    calculateInventory() {
      this.form.totalInventory = 0;
      this.wmsWarehouseMaterialDetailList.forEach(row => {
        if (row.inventory) {
          this.form.totalInventory = this.form.totalInventory + row.inventory;
        }
        if (row.lockInventory) {
          this.form.FreezeInventory = this.form.FreezeInventory + row.lockInventory;
        }
      })
    },
    handleWarehouseChange(val) {
      this.wmsWarehouseMaterialDetailList.forEach((row, index) => {
        row.whId = val;
        row.whRegionId = null;
        row.whLocationId = null;
        if (val) {
          this.getWhRegionOpts(val, index);
        }
      })
    },
    handleWhRegionChange(val, index) {
      this.wmsWarehouseMaterialDetailList[index].whLocationId = null;
      if (val) {
        this.getWhLocationOpts(val, index);
      }
    },
    //获取库区选项
    getWhRegionOpts(val, index) {
      if (!val) {
        return;
      }
      let queryParams = {
        warehouseId: val,
      }
      listWarehouseRegion(queryParams).then(res => {
        this.wmsWarehouseMaterialDetailList[index].whRegionOptions = res.rows;
      });
    },
    //获取库位选项
    getWhLocationOpts(val, index) {
      let queryParams = {
        regionId: val,
      }
      listWarehouseLocation(queryParams).then(res => {
        this.wmsWarehouseMaterialDetailList[index].whLocationOptions = res.rows;
      })
    },
    handleSelectMaterial() {
      this.materialSelectOpen = true;
    },
    handleMaterialSelected(list) {
      if (list && list.length > 0) {
        this.material = list[0];
        this.form.materialId = this.material.id;
        this.form.materialName = this.material.name;
        this.form.materialCode = this.material.code;
        this.form.materialModel = this.material.model;
        this.form.materialSpecification = this.material.specification;
        this.form.materialUnit = this.material.unit;
        this.setInventoryDetail();
      }
      this.materialSelectOpen = false;
    },
    //设置库存子表信息
    setInventoryDetail() {
      this.wmsWarehouseMaterialDetailList.forEach((row, index) => {
        //这是物料信息
        if (this.material) {
          row.materialName = this.material.name;
          row.materialCode = this.material.code;
          row.materialModel = this.material.model;
          row.materialSpecification = this.material.specification;
          row.materialUnit = this.material.unit;
        }
        this.getWhRegionOpts(this.form.warehouseId, index);
      })
    },
    /** 查询仓库物料信息列表 */
    getList() {
      this.loading = true;
      listMaterialInventory(this.queryParams).then(response => {
        this.materialInventoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 仓库字典翻译
    warehouseIdFormat(row, column) {
      return this.selectDictLabel(this.warehouseIdOptions, row.warehouseId);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.materialSelectOpen = false;
      this.reset();
    },
    handleMaterialCancel() {
      this.materialSelectOpen = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseId: null,
        materialId: null,
        totalInventory: null,
        freezeInventory: null,
        maxInventory: null,
        minInventory: null,
        materialName: null,
        materialModel: null,
        materialSpecification: null,
        materialUnit: null,
        wmsWarehouseMaterialDetailList: [],
      };
      this.wmsWarehouseMaterialDetailList = [];
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
      this.title = "添加仓库物料信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMaterialInventory(id).then(response => {
        this.form = response.data;
        response.data.wmsWarehouseMaterialDetailList.forEach(item => {
          let obj = {
            whRegionOptions: [],
            whLocationOptions: [],
          };
          let detail = Object.assign(obj, item);
          this.wmsWarehouseMaterialDetailList.push(detail);
        })
        this.wmsWarehouseMaterialDetailList.forEach((item, index) => {
          this.getWhRegionOpts(item.warehouseId, index);
          this.getWhLocationOpts(item.whRegionId, index);
        })
        this.material = {
          id: this.form.materialId,
          name: this.form.materialName,
          code: this.form.materialCode,
          model: this.form.materialModel,
          specification: this.form.materialSpecification,
          unit: this.form.materialUnit,
        };
        this.open = true;
        this.title = "修改仓库物料信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //this.form.wmsWarehouseMaterialDetailList = this.wmsWarehouseMaterialDetailList;
          if (this.form.id != null) {
            updateMaterialInventory(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialInventory(this.form).then(response => {
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
      this.$confirm('是否确认删除仓库物料信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delMaterialInventory(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 仓库物料明细序号 */
    rowWmsWarehouseMaterialDetailIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 仓库物料明细添加按钮操作 */
    handleAddWmsWarehouseMaterialDetail() {
      let obj = {};
      obj.whId = "";
      obj.whRegionId = "";
      obj.whLocationId = "";
      obj.serialNo = "";
      obj.productDate = "";
      obj.manufacturer = "";
      obj.batchNo = "";
      obj.inventory = "";
      obj.lockInventory = "";
      obj.remark = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecification = "";
      obj.materialUnit = "";
      obj.whRegionOptions = [];
      obj.whLocationOptions = [];
      this.wmsWarehouseMaterialDetailList.push(obj);
      //this.form.wmsWarehouseMaterialDetailList = this.wmsWarehouseMaterialDetailList;
      this.setInventoryDetail();
    },
    /** 仓库物料明细删除按钮操作 */
    handleDeleteWmsWarehouseMaterialDetail() {
      if (this.checkedWmsWarehouseMaterialDetail.length == 0) {
        this.$alert("请先选择要删除的仓库物料明细数据", "提示", {confirmButtonText: "确定",});
      } else {
        this.wmsWarehouseMaterialDetailList.splice(this.checkedWmsWarehouseMaterialDetail[0].index - 1, 1);
        //this.form.wmsWarehouseMaterialDetailList = this.wmsWarehouseMaterialDetailList;
      }
    },
    /** 单选框选中数据 */
    handleWmsWarehouseMaterialDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.wmsWarehouseMaterialDetail.clearSelection();
        this.$refs.wmsWarehouseMaterialDetail.toggleRowSelection(selection.pop());
      } else {
        this.checkedWmsWarehouseMaterialDetail = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有仓库物料信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportMaterialInventory(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
<style>
.el-table .lower {
  background-color: rgb(250, 232, 197);
}

.el-table .upper {
  background-color: rgb(255, 149, 111);
}
</style>
