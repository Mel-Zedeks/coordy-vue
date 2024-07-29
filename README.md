## Coordy - Vue

> Coordy is a smart Datatable that supports REST APIs / Inertia.js (Laravel - VILT) as backends

This package to help you build **Vue Or VILT (Vue, Inertia, Laravel Tailwind css)** applications faster without having to worry about things like

* Re-creating tables and styling each table
* Dealing with manual pagination.
* Table search
* Table Exports [print, csv, xlxs, pdf]
* Table filters
* add new buttons or links
* table actions like [edit, view, etc], supports string or object route construction
* Use Text, Links, Html or Vue Components in the table with slots.
* and more

## Installation
install using NPM

```shell
npm i @mel-zedeks/coordy-vue
```

import into your vue 3 "main.js" or "resources/js/app.js"

```javascript
import CoordyDataTable from '@mel-zedeks/coordy-vue'
```
use as component 
```javascript
 app.use(Coordy)
```

full code for vue 3 "resources/js/app.js" should look like this.
```javascript
import {createApp, h} from 'vue'
import {createInertiaApp} from '@inertiajs/inertia-vue3'

import Coordy from '@mel-zedeks/coordy-vue' // this place
// @ is an alias for ./scr directory
import store from "./store/index"

createInertiaApp({
    resolve: name => import(`./Pages/${name}`),
    setup({el, App, props, plugin}) {
        createApp({render: () => h(App, props)})
            .mixin({
                methods: {
                    route,
                }
            })
            .use(plugin)
            .use(store)
            .use(Coordy) // this place
            .mount(el)
    },
})
```

## Usage

Coordy expects a props that need to be passed

* data

the  data prop has 3 attributes
* content - responsible for the table content, pagination, entries
* settings - use to configure the table to enable features like 
  * checkbox
  * limit
  * search
  * sort and more
* headers - use to customize the table header content


## examples

### basic use:
```vue
const backend = reactive({
    // show only the data you want in the table, even when there are other data available in the records
    headers: ['name', 'age'], 
    content: {
        data: [
          // data from api
          {id:1, name:"John", age:20} 
        ]
    }
    settings: {
        tableTitle: "Table Name",
    }
}}
```


### CSS
add the following tailwind css classes to you main css file
```css
.z-table-wrapper{
    @apply w-3/4 rounded-sm bg-white  p-6 shadow
}
.z-btn{
    @apply bg-blue-600 text-white text-sm font-medium py-3 px-4 rounded-sm ml-1
}
.z-btn-sm{
    @apply bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded-sm ml-1
}
.z-btn-pg{
    @apply bg-blue-600 text-white text-xs font-medium py-1 px-2 ml-0.5
}
.z-input{
    @apply rounded-sm w-full p-2 focus:ring-blue-600 focus:outline-none focus:ring focus:ring-opacity-25 bg-gray-50 ring ring-opacity-25 ring-gray-300
}
.z-select{
    @apply rounded-sm  p-2 focus:ring-blue-600 focus:outline-none focus:ring focus:ring-opacity-25 bg-gray-50 ring ring-opacity-25 ring-gray-300
}
```