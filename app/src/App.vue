<template>
    <div class="flex justify-center items-center h-screen w-full bg-gray-200 ">
        <Coordy :data="backend2" class="style2" @coordy-payload="handlePayload">
            <!--            <template #balance="{content}">-->
            <!--                GHs {{ content['balance'] }}-->
            <!--            </template>-->
            <!--            <template #is_active="{content}">-->
            <!--                <span :class="['px-2 py-1',{'bg-emerald-500':content['is_active']===true,'bg-red-500':content['is_active']===false}]">{{-->
            <!--                    content['is_active']-->
            <!--                    }}</span>-->
            <!--            </template>-->

        </Coordy>
        <!--      <z-table -->
        <!--               @table-action-called="(e)=> testEvent(e)"-->
        <!--               @sort-order="(e)=> testEvent(e)"-->
        <!--               @selected-button-filter="(e)=> filtering(e)"-->
        <!--               @auto-search="(e)=> testEvent(e)"-->
        <!--               @change-page-length="(e)=> pageLength(e)"-->
        <!--               @pagination="(e)=> paginate(e)"-->
        <!--               @exports="(e)=> testEvent(e)"-->

        <!--      >-->
        <!--        <template #country="{content}">-->
        <!--          {{ content['country']?.name }}-->
        <!--        </template>-->
        <!--        <template #region="{content}">-->
        <!--          <div class="relative h-6 w-6"><img :src="content.avatar" class="rounded-full h-6" alt="user"><span-->
        <!--              class=""> </span></div>-->

        <!--        </template>-->
        <!--      </z-table>-->

    </div>
</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import CCheckbox from "../../src/Components/Forms/c-checkbox.vue";
import axios from "axios";

onMounted(() => {
    getData()
})
const selectAllRows = ref(false)
const selectedRows = ref([])
const searchTerm = ref("")
const searchFields = ref([])
const limit = ref("")
const page = ref("")
const urlQuery = ref("")
const handlePayload = (e) => {
    console.log(e)
    //checkboxes
    selectedRows.value = e.body.checkbox.selected
    selectAllRows.value = e.head.checkbox.selectAll

    //pagination
    page.value = e.footer.pagination
    //limit
    limit.value = e.head.limit

    //search
    searchTerm.value = e.head.search.text
    searchFields.value = e.head.search.fields

    let query = []
    if (page.value) {
        let pageNum = parseInt(page.value?.page) || 1;
        query.push("page=" + pageNum)
    }
    if (limit.value) {
        let limits = parseInt(limit.value) || 10;
        query.push("limit=" + limits)
    }
    if (searchTerm.value) {
        query.push("search=" + searchTerm.value)
    }

    urlQuery.value = query.join('&')
    getData(urlQuery.value)

}
const getData = (query = null) => {
    // const url = new URL(window.location);
    let queryStr = ""
    let url = window.location
    let backUrl = "http://127.0.0.1:8000/test"
    if (query) {
        queryStr = "?" + query
        url =  url + queryStr
        window.history.replaceState({}, '', url);
        backUrl = backUrl + queryStr
    }
    console.log(backUrl)
    axios.get(backUrl).then(res => {
        backend2.content = res.data.data
    })

}
const backend2 = reactive({
    headers: ["name",
        {
            key: "token",
            label: "Access Token"
        }
    ],
    content: [],
    settings: {
        tableTitle: "All Apps",
        addNew: {
            uri: "",
            label: "MyCreate"
        },
        limits: {
            default: "30",
            options: [
                {
                    key: "10",
                    label: "10",
                },
            ]
        },
        search: {
            placeholder: "Search",
            autoSearch: true,
            debounce: 500,
        },
        actions: {
            type: "dropDown",// => dropDown | iconButtons | textButtons | rightClickRow | clickRow
            position: "trailing", // leading | trailing works with => dropDown | iconButtons | textButtons
            return: "object", // string | object => string= '/show/:id/:others' object= {route:'users.show',[params],type}
            data: [
                {
                    label: "View and something",
                    route: "user.show",
                    params: {
                        user: "id",
                        email: "email"
                    },
                    method: "get"
                }
            ]
        }
    }

});
const backend = reactive({
    headers: [
        {
            key: "classsections[*].name",
            label: "academic_year",
        },
        'name',
        // {
        //     key: "image.original_url",
        //     label: "Photo",
        //     type: "html",
        //     template: `<img src="bootstrap" class="h-12 w-12 bg-white rounded-full border" alt="..."/>`
        // },
        // {
        //     key: "id",
        //     label: "ID",
        //     type: "link",
        //     template: "http://localhost:5173/:id",
        //     templateKey: "id",
        // },
        // 'full_name',
        // {
        //     key: 'email',
        //     type: "html",
        //     template: `<a style="color: #2563eb" href="mailto:%value%">%label%:%value%</a>`
        // },
        // {
        //     label: "Status",
        //     key: "is_active",
        //     type: 'slot',
        // },
        // {
        //     key: "balance",
        //     type: 'slot',
        // },
        // {
        //   label: "Email2",
        //   key: "email",
        //   type: "checkbox",
        // }
    ],
    content: {
        data: [
            {
                "_id": "6539ea6dbd8d895d49d57480",
                "class_section_ids": ["6539e7ffbd8d895d49d5747e", "6539e807bd8d895d49d5747f"],
                "classsections": [{
                    "_id": "6539e7ffbd8d895d49d5747e",
                    "name": "A",
                    "timestamp": {"created_at": "0001-01-01T00:00:00Z", "updated_at": "0001-01-01T00:00:00Z"}
                }, {
                    "_id": "6539e807bd8d895d49d5747f",
                    "name": "B",
                    "timestamp": {"created_at": "0001-01-01T00:00:00Z", "updated_at": "0001-01-01T00:00:00Z"}
                }],
                "name": "Class 1",
                "timestamp": {"created_at": "0001-01-01T00:00:00Z", "updated_at": "0001-01-01T00:00:00Z"}
            }
        ]
        // data: [
        //     {
        //         "id": 1,
        //         "is_active": true,
        //         "email": 'mel.logo@example.com',
        //         "full_name": "Mel logo",
        //         "image": {
        //             id: 1,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 3000,
        //         "created_at": "2020-01-01T16:13:41.000000Z",
        //         "updated_at": "2020-01-01T16:13:41.000000Z",
        //     },
        //     {
        //         "id": 2,
        //         "is_active": true,
        //         "email": 'john.doe@example.com',
        //         "full_name": "John Doe",
        //         "image": {
        //             id: 2,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 4000,
        //         "created_at": "2020-02-02T14:30:22.000000Z",
        //         "updated_at": "2020-02-02T14:30:22.000000Z",
        //     },
        //     {
        //         "id": 3,
        //         "is_active": false,
        //         "email": 'alice.smith@example.com',
        //         "full_name": "Alice Smith",
        //         "image": {
        //             id: 3,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 1500,
        //         "created_at": "2020-03-03T09:45:15.000000Z",
        //         "updated_at": "2020-03-03T09:45:15.000000Z",
        //     },
        //     {
        //         "id": 4,
        //         "is_active": true,
        //         "email": 'jane.roe@example.com',
        //         "full_name": "Jane Roe",
        //         "image": {
        //             id: 4,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 2800,
        //         "created_at": "2020-04-04T18:20:37.000000Z",
        //         "updated_at": "2020-04-04T18:20:37.000000Z",
        //     },
        //     {
        //         "id": 5,
        //         "is_active": true,
        //         "email": 'sam.jackson@example.com',
        //         "full_name": "Sam Jackson",
        //         "image": {
        //             id: 5,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 5000,
        //         "created_at": "2020-05-05T12:15:10.000000Z",
        //         "updated_at": "2020-05-05T12:15:10.000000Z",
        //     },
        //     {
        //         "id": 6,
        //         "is_active": false,
        //         "email": 'david.brown@example.com',
        //         "full_name": "David Brown",
        //         "image": {
        //             id: 6,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 900,
        //         "created_at": "2020-06-06T08:55:48.000000Z",
        //         "updated_at": "2020-06-06T08:55:48.000000Z",
        //     },
        //     {
        //         "id": 7,
        //         "is_active": true,
        //         "email": 'laura.wilson@example.com',
        //         "full_name": "Laura Wilson",
        //         "image": {
        //             id: 7,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 750,
        //         "created_at": "2020-07-07T17:40:29.000000Z",
        //         "updated_at": "2020-07-07T17:40:29.000000Z",
        //     },
        //     {
        //         "id": 8,
        //         "is_active": true,
        //         "email": 'peter.evans@example.com',
        //         "full_name": "Peter Evans",
        //         "image": {
        //             id: 8,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 2000,
        //         "created_at": "2020-08-08T11:22:55.000000Z",
        //         "updated_at": "2020-08-08T11:22:55.000000Z",
        //     },
        //     {
        //         "id": 9,
        //         "is_active": false,
        //         "email": 'olivia.baker@example.com',
        //         "full_name": "Olivia Baker",
        //         "image": {
        //             id: 9,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 350,
        //         "created_at": "2020-09-09T19:05:14.000000Z",
        //         "updated_at": "2020-09-09T19:05:14.000000Z",
        //     },
        //     {
        //         "id": 10,
        //         "is_active": true,
        //         "email": 'william.clark@example.com',
        //         "full_name": "William Clark",
        //         "image": {
        //             id: 10,
        //             original_url: "link/to/some/dummy/profile-image"
        //         },
        //         balance: 6000,
        //         "created_at": "2020-10-10T15:12:33.000000Z",
        //         "updated_at": "2020-10-10T15:12:33.000000Z",
        //     },
        //     // Add 9 more entries following a similar structure here...
        // ],
        // links: [
        //   {
        //     "url": null,
        //     "label": "&laquo; Previous",
        //     "active": false
        //   },
        //   {
        //     "url": "http://clockin.vbox/test?page=1",
        //     "label": "1",
        //     "active": true
        //   },
        //   {
        //     "url": "http://clockin.vbox/test?page=2",
        //     "label": "2",
        //     "active": false
        //   },
        //   {
        //     "url": "http://clockin.vbox/test?page=3",
        //     "label": "3",
        //     "active": false
        //   },
        //   {
        //     "url": "http://clockin.vbox/test?page=4",
        //     "label": "4",
        //     "active": false
        //   },
        //   {
        //     "url": "http://clockin.vbox/test?page=5",
        //     "label": "5",
        //     "active": false
        //   },
        // ],

        // meta: {
        //   "current_page": 1,
        //   "from": 31,
        //   "last_page": 1,
        //   "links": [
        //     {
        //       "url": null,
        //       "label": "&laquo; Previous",
        //       "active": false
        //     },
        //     {
        //       "url": "http://127.0.0.1:8000/api/receiver?page=1",
        //       "label": "1",
        //       "active": true
        //     },
        //     {
        //       "url": null,
        //       "label": "Next &raquo;",
        //       "active": false
        //     }
        //   ],
        //   "path": "http://127.0.0.1:8000/api/receiver",
        //   "per_page": 30,
        //   "to": 60,
        //   "total": 258
        // }
    },
    settings: {
        //   tableClasses: {},
        tableTitle: "My new Table",
        addNew: {
            uri: "",
            label: "MyCreate"
        },
        addBulk: {
            uri: "",
            label: "Bulk Upload"
        },
        limits: {
            default: "30",
            options: [
                {
                    key: "10",
                    label: "10",
                },
                {
                    key: "30",
                    label: "30",
                },
                {
                    key: "50",
                    label: "50",
                },
                {
                    key: "100",
                    label: "100",
                },
                {
                    key: "-1",
                    label: "All",
                },
            ]
        },
        search: {
            placeholder: "Search",
            // buttonLabel: "Search",
            // custom_buttom:false, Todo
            autoSearch: true,
            debounce: 500,
            // fields: [] todo
        },
        exports: ['pdf', 'xlsx', 'csv'],
        tableFilter: {
            state: true,
            type: "button",
            activeFilter: 'all',
            data: [
                {
                    label: "All",
                    columnName: "role",
                    key: "all"
                },
                {
                    label: "Org. Admin",
                    columnName: "role",
                    key: "Org. Admin"
                },
                {
                    label: "Super Admin",
                    columnName: "role",
                    key: "Super Admin"
                },
                {
                    label: "Regional Admin",
                    columnName: "role",
                    key: "Regional Admin"
                },
                {
                    label: "National Admin",
                    columnName: "role",
                    key: "National Admin"
                },
                {
                    label: "Active",
                    columnName: "status",
                    key: 1
                },
                {
                    label: "Inactive",
                    columnName: "status",
                    key: 0
                }
            ],
        },
        actions: {
            type: "iconButtons",// => dropDown | iconButtons | textButtons | rightClickRow | clickRow
            position: "trailing", // leading | trailing works with => dropDown | iconButtons | textButtons
            return: "object", // string | object => string= '/show/:id/:others' object= {route:'users.show',[params],type}
            data: [
                {
                    label: "View",
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
</svg>`,
                    route: "user.show",
                    params: {
                        user: "id",
                        email: "email"
                    },
                    method: "get" // used for return type object
                },
                {
                    label: "Edit",
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
<path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
</svg>`,
                    route: "user.show",
                    params: {
                        id: "id",
                    },
                    method: "get"
                },
                {
                    label: "Activate",
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`,
                    route: "user.activate",
                    params: {
                        user: "id",
                    },
                    method: "get",
                    // condition: {
                    //     check: {//Todo advance where , or, and , query
                    //         if: 'is_active',
                    //         is: "eq", // eq, lt, lte, gt, gte,btw
                    //     },
                    //     then: {
                    //         true: {
                    //             label: 'Deactivate',
                    //             icon: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>`,
                    //             route: "user.deactivate"
                    //         },
                    //     }
                    // },
                }
            ]
        },


        //   // filters: [],

        bulkActions: {
            state: false,
        },
        header: {
            checkbox: {
                key: "name"
                // selectAll: {
                //     state: true,
                //     default: false
                // }
            },
            sort: {
                state: true
            }
        }
        // checkbox: {
        //   state: true,
        // },
        //   // pagination: {
        //   //   state:true
        //   // },
    }
})


</script>

