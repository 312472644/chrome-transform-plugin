<template>
  <el-scrollbar height="380px">
    <div class="transform">
      <div class="input">
        <el-input
          :class="{ 'error-input': isValid }"
          type="textarea"
          v-model.trim="content"
          @input="(event) => (isValid = Boolean(event.value))"
          :rows="5"
        ></el-input>
      </div>
      <div class="btn">
        <div class="language">
          <el-select class="select" v-model="fromLang" placeholder="请选择">
            <el-option
              v-for="item in langLeftOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-icon
            class="switch"
            :size="20"
            color="#909399"
            @click="switchHandle"
          >
            <Switch />
          </el-icon>
          <el-select class="select" v-model="toLang" placeholder="请选择">
            <el-option
              v-for="item in langRightOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button plain type="primary" @click="transForm">翻译</el-button>
      </div>
      <div>
        <el-checkbox-group v-model="checkList" :min="1">
          <el-checkbox
            v-for="item in transOptions"
            :key="item.value"
            :label="item.value"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="result">
        <!--百度翻译-->
        <el-card v-show="isQuery.baidu" class="box-card">
          <template #header>
            <div class="card-header">
              <span>百度翻译</span>
            </div>
          </template>
          <div
            class="transform-result"
            element-loading-text="翻译中..."
            v-loading="loading.baiduLoading"
            :element-loading-spinner="loadingSvg"
          >
            <div v-if="transFormResult.baidu?.error_code" class="error">
              网络错误，请稍后再试
            </div>
            <div
              v-else
              v-for="item in transFormResult.baidu.trans_result"
              :key="item"
              class="result-item"
            >
              <span>{{ item.dst }}</span>
              <el-icon
                :size="20"
                class="copy-icon"
                title="复制"
                @click="copy(item.dst)"
                ><CopyDocument
              /></el-icon>
            </div>
          </div>
        </el-card>
        <!--有道翻译-->
        <el-card
          v-show="isQuery.youdao && checkList.includes('youdao')"
          class="box-card"
        >
          <template #header>
            <div class="card-header">
              <span>有道翻译</span>
            </div>
          </template>
          <div
            class="transform-result"
            element-loading-text="翻译中..."
            v-loading="loading.youdaoLoading"
            :element-loading-spinner="loadingSvg"
          >
            <div v-if="transFormResult.youdao?.errorCode !== '0'" class="error">
              网络错误，请稍后再试
            </div>
            <div
              v-else
              v-for="item in transFormResult.youdao.translation"
              :key="item"
              class="result-item"
            >
              <span>{{ item }}</span>
              <el-icon
                :size="20"
                class="copy-icon"
                title="复制"
                @click="copy(item)"
                ><CopyDocument
              /></el-icon>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { reactive, ref } from "vue";
import { transFromBaidu, transFormYoudao } from "../api";
import ClipboardJS from "clipboard";
import { ElMessage } from "element-plus";

const content = ref("");
const isValid = ref(false);
const isQuery = ref({
  baidu: false,
  youdao: false,
});
const fromLang = ref("zh");
const toLang = ref("en");
const checkList = ref(["baidu"]);
const transOptions = [
  { label: "开启百度翻译", value: "baidu", disabled: true },
  { label: "开启有道翻译", value: "youdao", disabled: false },
];

const loading = reactive({
  baiduLoading: false,
  youdaoLoading: false,
});
const transFormResult = reactive({
  baidu: {},
  youdao: {},
});
const loadingSvg = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" fill="#409EFF"><path d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>`;

const langLeftOptions = [
  { label: "中文", value: "zh" },
  { label: "英文", value: "en" },
];
const langRightOptions = [
  { label: "中文", value: "zh" },
  { label: "英文", value: "en" },
];

const switchHandle = () => {
  const initLeft = fromLang.value;
  const initRight = toLang.value;
  fromLang.value = initRight;
  toLang.value = initLeft;
};

const copy = (val) => {
  const clipboard = new ClipboardJS(".copy-icon", {
    text: () => val,
  });
  clipboard.on("success", () => {
    ElMessage({
      type: "success",
      message: "复制成功！",
    });
    clipboard.destroy();
  });
};

const getQueryParams = (type) => {
  return {
    from:
      type === "youdao"
        ? fromLang.value === "zh"
          ? "zh-CHS"
          : fromLang.value
        : fromLang.value,
    to:
      type === "youdao"
        ? toLang.value === "zh"
          ? "zh-CHS"
          : toLang.value
        : toLang.value,
    q: content.value,
  };
};

const transForm = async () => {
  if (!content.value) {
    isValid.value = true;
    return;
  }
  isQuery.value.baidu = true;
  loading.baiduLoading = true;

  transFromBaidu(getQueryParams()).then((res) => {
    loading.baiduLoading = false;
    transFormResult.baidu = res.data;
  });

  if (checkList.value.includes("youdao")) {
    loading.youdaoLoading = true;
    isQuery.value.youdao = true;
    transFormYoudao(getQueryParams("youdao")).then((res) => {
      loading.youdaoLoading = false;
      transFormResult.youdao = res.data;
    });
  }
};
</script>

<style lang="scss">
.transform {
  width: 500px;
  background: #fff;
  padding: 15px;

  .btn {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
  }

  .language {
    display: flex;
    align-items: center;
  }

  .switch {
    padding: 0 10px;
    cursor: pointer;
  }

  .select {
    width: 80px;
  }

  .el-card__header {
    padding: 10px 15px;
  }

  .card-header {
    font-size: 14px;
    color: #606266;
  }

  .el-card__body {
    color: #909399;
    font-size: 13px;
  }

  .box-card {
    margin-bottom: 10px;
  }
  .transform-result {
    min-height: 40px;
  }
  .circular {
    width: 20px;
    height: 20px;
  }
  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: inherit;
  }
  .result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .copy-icon {
    cursor: pointer;
  }
  .error-input {
    .el-textarea__inner {
      box-shadow: 0 0 0 1px #f56c6c;
    }
  }
  .el-checkbox {
    vertical-align: middle;
    margin-right: 10px;
  }
}
</style>
