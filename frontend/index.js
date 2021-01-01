import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    useLoadable, 
    useWatchable,
    useRecordById,
} from '@airtable/blocks/ui';
import axios from 'axios'
import { cursor } from '@airtable/blocks';
import React from 'react';


function Spellcheck() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const table = base.getTableByName('Imported table');

    const defaultFieldId = table.getFieldByName("AUDIT").id
    const defaultRecordId = useRecords(table)[0].id

    const watchedFields = ['AUDIT'].map((field) => table.getFieldByName(field).id)
    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds']);
    const fieldId = cursor.selectedFieldIds[0] || defaultFieldId

    const recordId = cursor.selectedRecordIds[0] || defaultRecordId

    const record = recordId ? useRecordById(table, recordId) : useRecords(table)[0]

    const cell = fieldId ? record.getCellValue(fieldId) : record.getCellValue("TL_ID")


    const field = watchedFields.includes(fieldId) ? <div>{cell}</div> : null;



   

    return (
        <div>
            {field}
            <button onClick={() => { axios.get('/')}}>fire</button>
        </div>);
}



initializeBlock(() => <Spellcheck />);
