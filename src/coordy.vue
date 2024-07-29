<script setup>
import CLinkBtn from "@/Components/Forms/c-link-btn.vue";
import CBtn from "@/Components/Forms/c-btn.vue";
import CInput from "@/Components/Forms/c-input.vue";
import CSelect from "@/Components/Forms/c-select.vue";
import CLoadingModal from "@/Components/modals/c-loading-modal.vue";
import CContentCounter from "@/Components/Table/c-content-counter.vue";
import CPagination from "@/Components/Table/c-pagination.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import CTableHeader from "@/Components/Table/c-table-header.vue";
import {useObj} from "@/Composable/useObj.js";
import {useDataTable} from "@/Composable/useDataTable.js";
import _ from "lodash";
import CTableActions from "@/Components/Table/c-table-actions.vue";
import {useStatics} from "@/Composable/useStatics.js";

const props = defineProps({
    data: {
        type: Object,

        required: true,
        validator(value) {
            const {hasKey} = useObj()
            if (hasKey(value, ['content', 'settings', 'headers'])) {
                return true
            }
            throw new Error("data prop must have the follow ['headers','content','settings']")
        }
    }
})
// onBeforeMount(()=>isLoading.value=!isLoading.value)
// onMounted(()=>isLoading.value=!isLoading.value)
const {hasKey, length} = useObj()
const {getContentByKey, slotName, computeHeaders, computeLinkTemplate, computeHtmlTemplate} = useDataTable()

const pickHeaders = computed(() => props.data?.headers)
const pickSettings = computed(() => props.data?.settings)
const pickContent = computed(() => props.data?.content)

const defaultSettings = reactive({
    tableTitle: {
        state: false,
        label: "Table"
    },
    createSection: {
        create: {
            state: true,
            url: "",
            label: "Create"
        },
        bulkCreate: {
            state: false,
            url: "",
            label: "Bulk Create"
        }
    },
    pageLength: {
        state: false,
        options: [
            {
                key: "10",
                value: "10",
            },
            {
                key: "30",
                value: "30",
            },
            {
                key: "50",
                value: "50",
            },
            {
                key: "100",
                value: "100",
            },
            {
                key: "-1",
                value: "All",
            },
        ]
    },
    search: {
        state: false,
        placeholder: "Search",
        useButton: false,
        buttonLabel: "Search",
        // custom_buttom:false, Todo
        autoSearch: true,
        debounce: 2000
    },
    pagination: {
        state: false
    },
    actions: {
        state: false,
        position: "row",// row / column-end /column-start
        data: []
    },
    tableFilter: {
        state: false,
        type: "button"
    },
    exports: {
        state: false,
        actions: ['pdf', 'xlsx', 'csv', 'print']
    },
    bulkActions: {
        state: false,
    },
    checkbox: {
        state: false,
    }
})
const {columnTypes} = useStatics();
// table title
const tableTitle = hasKey(pickSettings.value, 'tableTitle') ? pickSettings.value.tableTitle : ""
const addNew = hasKey(pickSettings.value, 'addNew') ? pickSettings.value.addNew : {}
const addBulk = hasKey(pickSettings.value, 'addBulk') ? pickSettings.value.addBulk : {}
const limits = hasKey(pickSettings.value, 'limits') ? pickSettings.value.limits : {}
const search = hasKey(pickSettings.value, 'search') ? pickSettings.value.search : {}
const exports = hasKey(pickSettings.value, 'exports') ? pickSettings.value.exports : []
const actions = hasKey(pickSettings.value, 'actions') ? pickSettings.value.actions : {}
const checkBox = ref([])
// functions
const selectAllCheckBoxes = (value) => {
    if (value) {
        const key = pickSettings.value.header.checkbox?.key || 'id'
        checkBox.value = _.map(pickContent.value.data, key)
    } else {
        _.remove(checkBox.value)
    }

    preparePayload('head.checkbox.selectAll', value)
}
const isLoading = ref(false)
const payLoad = ref({
    head: {
        checkbox: {
            selectAll: false,
        },
        search: {
            text: "",
            fields: []
        },
        limit: "",
        exports: {},
    },
    body: {
        checkbox: {
            selected: []
        },
        sort: [],
        actions: {},
    },
    footer: {
        pagination: {
            url: null,
            page: 1,
            state: false
        }
    }
})
const emit = defineEmits(['coordy-payload'])
const searchTerm = ref("")
const selectedLimit = ref("")
const tableCounter = ref({})
watch(selectedLimit, (value, oldValue) => preparePayload('head.limit', value))
watch(checkBox, (value, oldValue) => preparePayload('body.checkbox.selected', value))
const handleSearch = () => {
    preparePayload('head.search.text', searchTerm.value)
}
const debounceSearchField = _.debounce(handleSearch, 500)
const preparePayload = (section, data) => {
    // isLoading.value=!isLoading.value
    _.update(payLoad.value, section, value => data)
    // isLoading.value=!isLoading.value
}

watch(payLoad, (value, oldValue) => {
    emit('coordy-payload', value)
}, {deep: true})

onMounted(() => {
    setTimeout(() => {
        window.HSStaticMethods.autoInit();
    }, 100)
})
</script>

<template>
    <div class="flex flex-wrap mt-4 w-full relative">
        <div class="w-full mb-12 px-4">
            <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
            >
                <section class="rounded-t mb-0 px-4 py-3 border-0">
                    <div class="flex justify-between items-center">
                        <div class="">
                            <span class="table-title">
                                {{ tableTitle }}
                                <!--                                table title-->
                            </span>
                        </div>

                    </div>
                </section>
                <section class=" mb-0 px-4 py-1 border-0">
                    <div class="flex justify-between items-center">
                        <div>
                            <!--                            mel-->
                        </div>
                        <div class="group-btn-wrapper">
                            <c-btn v-if="exports.length>0" v-for="(exprt,index) in exports" :key="index"
                                   @click.prevent="preparePayload('head.exports',{action:exprt,options:tableCounter})">
                                {{ exprt.toUpperCase() }}
                            </c-btn>
                        </div>
                    </div>
                </section>
                <section class=" z-section-1">
                    <div class="z-section-container">
                        <div class="z-table-limit-wrapper">
                            <c-select class=" w-18" v-if="length(limits) > 0 && limits.options"
                                      :default-value="limits.default" :options="limits?.options"
                                      v-model="selectedLimit"/>
                            <!--                            <c-select class=" w-28 max-w-32"-->
                            <!--                                      :options="[{key:'delete',label:'Delete'},{key:'edit',label:'Edit'}]"/>-->
                        </div>
                        <div class="z-table-search-wrapper">
                            <c-input v-if="length(search)>0" :placeholder="search.placeholder"
                                     @input="debounceSearchField" v-model="searchTerm"/>
                        </div>
                    </div>
                    <div class="z-section-container">
                        <div class="flex justify-end items-center space-x-2">
                            <c-link-btn class="z-btn" :label="addNew?.label" :uri="addNew?.uri"
                                        v-if="length(addNew)>0 && addNew.label"/>
                            <c-link-btn class="z-btn" :label="addBulk?.label" :uri="addBulk?.uri"
                                        v-if="length(addBulk)>0 && addBulk.label"/>
                        </div>
                    </div>
                </section>
                <div class="z-table-container">
                    <!-- Projects table -->
                    <c-loading-modal v-if="isLoading"/>
                    <table class="z-table">
                        <c-table-header :headers="pickHeaders" :options="pickSettings.header" :table-actions="actions"
                                        @select-all="selectAllCheckBoxes"
                                        @sort-headers="(e)=>preparePayload('body.sort',e)"/>
                        <tbody>
                        <template v-if="hasKey(pickContent,'data')"
                                  v-for="(content, content_index) in pickContent?.data" :key="content_index">

                            <tr>

                                <template
                                        v-for="(header, header_index) in computeHeaders(pickHeaders,actions,hasKey(pickSettings.header,'checkbox'))"
                                        :key="header_index">
                                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <input type="checkbox" v-if="header.type ==='checkbox'"
                                               :value="content[pickSettings.header.checkbox.key || 'id']" class=""
                                               v-model="checkBox"/>
                                        <!--                                    <template v-else>-->
                                        <template v-if="columnTypes.includes(header.type)">
                                            <template v-if="header.type==='slot'">
                                                <slot :name="slotName(header.key)" :content="content">
                                                </slot>
                                            </template>
                                            <template v-if="header.type==='component'">
                                                <!--                 Todo                               <component is=""/>-->
                                                <!--                                                <div v-html="getContentByKey(content,header.key)"></div>-->
                                            </template>
                                            <template v-if="header.type==='html'">
                                                <div v-html="computeHtmlTemplate(header,content)"></div>
                                            </template>
                                            <template v-if="header.type==='text'">
                                                <div v-text="getContentByKey(content,header.key)"></div>
                                            </template>
                                            <template v-if="header.type==='link'">

                                                <a v-if="!header.emit" :href="computeLinkTemplate(header,content)">{{
                                                    getContentByKey(content, header.key)
                                                    }}</a>
                                                <a v-else href="#"
                                                   @click.prevent="(e)=> alert(getContentByKey(content, header.key))">{{
                                                    getContentByKey(content, header.key)
                                                    }}</a>
                                            </template>
                                        </template>
                                        <!--                                    </template>-->
                                        <c-table-actions :content="content" v-if="header.type ==='action'"
                                                         :options="actions"
                                                         @table-action="(e)=>preparePayload('body.actions',e)"></c-table-actions>
                                    </td>
                                </template>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                    <div v-if="!hasKey(pickContent,'data') || pickContent.data.length===0"
                         class=" w-full h-24 flex justify-center items-center z-50">
                        <p class="flex justify-center items-center space-x-4"><span>No Record Found</span></p>
                    </div>
                </div>
                <section class="mb-0 px-4 py-3 border-0 flex justify-between items-center">
                    <!--        count-->
                    <c-content-counter :content="pickContent" @counter="(e)=>tableCounter.value=e"/>
                    <!--        pagination-->
                    <c-pagination :content="pickContent"  @pagination="(e)=>preparePayload('footer.pagination',e)"/>

                </section>

            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
