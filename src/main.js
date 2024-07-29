import Coordy from "@/coordy.vue";
import "@/css/coordy-vue.css"
import "preline/preline";

module.exports =  {
    install: (app, options) => {
        app.component("Coordy",Coordy)
    },
};