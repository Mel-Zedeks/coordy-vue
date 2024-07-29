import {useObj} from "@/Composable/useObj.js";
import {useStr} from "@/Composable/useStr.js";
import _ from "lodash";
import {useStatics} from "@/Composable/useStatics.js";


const {toTitle, toSlug, removeSlug} = useStr()
const {hasKey, length} = useObj()

export function useDataTable() {

    const computeHtmlTemplate = (header, content) => {
        const template = hasKey(header, 'template') ? header.template : null
        if (template && typeof template === 'string') {
            return template.trim().replace(/%value%+/g, content[header.key]).replace(/%key%+/g, header.key).replace(/%label%+/g, header.label)
        }
        return "<span>null</span>"
    }
    const computeLinkTemplate = (header, content) => {
        const template = hasKey(header, 'template') ? header.template : null
        const templateKey = hasKey(header, 'templateKey') ? header.templateKey : header.key
        if (template && typeof template === 'string') {
            return template.trim().replace(/:id+/g, content[templateKey])
        }
        return "#"
    }
    const computeHeaders = (headers, actions = {}, enableCheckbox = false) => {
        const newHeaders = [];

        headers.forEach(header => {
            let type = "text";
            let sortable = false;
            let emit = "";
            let label = "";
            let key = "";
            let template = "";
            let templateKey = "";

            if (typeof header === "object") {
                label = header?.label || header.key;
                key = header.key;
                type = header.type || type;
                sortable = header.sortable || sortable;
                template = header.template || null;
                templateKey = ['link'].includes(type) ? header.templateKey || header.key : templateKey
                emit = ['link'].includes(type) ? header.emit || false : emit
            }
            if (typeof header === "string") {
                label = header;
                key = header;
            }

            const {columnTypes} = useStatics();
            if (columnTypes.includes(type)) {
                newHeaders.push(_.omitBy({
                    label: toTitle(removeSlug(label)),
                    key: hasDotOrNumberBracket(key) ? key : toSlug(key, "_"),
                    type,
                    sortable,
                    template,
                    templateKey: toSlug(templateKey, "_"),
                    emit,
                }, value => value === '' || value === null));
            }

        });
        if (enableCheckbox) {
            newHeaders.unshift({
                label: toTitle("checkbox"),
                key: "checkbox",
                type: "checkbox",
            })
        }
        if (length(actions) > 0) {
            let newAction = {
                label: toTitle("actions"),
                key: "actions",
                type: "action",
            }
            if (hasKey(actions, 'position') && actions.position === 'leading') {
                newHeaders.unshift(newAction)
            } else {
                newHeaders.push(newAction)
            }
        }


        return newHeaders;
    }
    const hasDotOrNumberBracket = (str) => {
        // Check if the string contains a dot (.) or a square bracket with a number inside ([number])
        return /\./.test(str) || /\[\d+\]/.test(str);
    }
    const slotName = (key, defaultValue = undefined) => {
        if (typeof key !== 'string' || key.trim() === '') {
            return defaultValue;
        }
        const parts = key.split('.');
        return parts[0]
    }
    const getContentByKey = (content, key, defaultValue = undefined) => {
        if (typeof key !== 'string' || key.trim() === '') {
            return defaultValue;
        }
        // Split the key by '.' or '[', ']', and filter out empty parts
        // const parts = key.split('.');
        const parts = key.split(/\.|\[|\]/).filter(part => part !== '');
        let newContent = content;

        // for (const part of parts) {
        //     if (!newContent || !hasKey(newContent, part)) {
        //         return defaultValue;
        //     }
        //     newContent = newContent[part];
        // }
        // console.log(parts)
        for (const part of parts) {
            // Check if part is a number (array index)
            const index = parseInt(part);
            if (!isNaN(index)) {
                // If newContent is an array, use the index
                if (Array.isArray(newContent)) {
                    newContent = newContent[index];
                } else {
                    return defaultValue; // Invalid array index, return defaultValue
                }
            } else if (part === "*") {
                if (Array.isArray(newContent)) {

                } else {
                    return defaultValue; // Invalid array index, return defaultValue
                }
            } else {
                // If newContent is an object, use the part as key
                if (Array.isArray(newContent)) {
                    let newConcat = ""
                    newContent.forEach((cont) => {
                        newConcat += cont[part]+", "
                    })
                    newContent = newConcat
                } else if (newContent !== null && typeof newContent === 'object' && hasKey(newContent, part)) {
                    newContent = newContent[part];
                } else {
                    return defaultValue; // Invalid key, return defaultValue
                }
            }
        }

        return newContent !== undefined ? newContent : defaultValue;
    }
    return {computeHeaders, computeLinkTemplate, computeHtmlTemplate, slotName, getContentByKey}
}

