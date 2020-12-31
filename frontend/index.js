import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    useLoadable, 
    useWatchable,
    useRecordById,
} from '@airtable/blocks/ui';
import { cursor } from '@airtable/blocks';
import React from 'react';


function Spellcheck() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const table = base.getTableByName('Imported table');
    // const records = useRecords(table);
    const defaultFieldId = table.getFieldByName("AUDIT").id
    const defaultRecordId = useRecords(table)[0].id
    const watchedFields = ['AUDIT'].map((field) => table.getFieldByName(field).id)
    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds']);
    const fieldId = cursor.selectedFieldIds[0] || defaultFieldId
    console.log("26 fieldId: ", fieldId)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    const recordId = cursor.selectedRecordIds[0] || defaultRecordId
    console.log("29 recordId: ", recordId)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    const record = recordId ? useRecordById(table, recordId) : useRecords(table)[0]
    console.log("32 record: ", record)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    const cell = fieldId ? record.getCellValue(fieldId) : record.getCellValue("TL_ID")
    console.log("35 cell: ", cell)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

    const field = watchedFields.includes(fieldId) ? <div>{cell}</div> : null;

    // if (watchedFields.includes(cursor.selectedFieldIds[0])) {
    //     console.log(record)
    //     console.log(cell)

    // } 


   

    return (
        <div>
            {field}
        </div>);
}



initializeBlock(() => <Spellcheck />);
