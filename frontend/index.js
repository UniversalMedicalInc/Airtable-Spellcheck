import {
    initializeBlock,
    useBase,
    useRecords,
    TablePickerSynced,
    useGlobalConfig,
} from '@airtable/blocks/ui';
import React from 'react';
import { getRecords, setRecords, findChangedRecord } from './records'


function Spellcheck() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const table = base.getTableByIdIfExists(tableId);
    const records = useRecords(table);

    console.log(records[0])
    console.log(Object.values(records))
    if (records === getRecords()) {
        console.log('no change', records)
    } else {
        console.log("false 30 records: ", records)
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        const storedRecords = getRecords()
        console.log("false 33 storedRecords: ", storedRecords)
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        setRecords(records)
        const newStoredRecords = getRecords()
        console.log("false 37 newStoredRecords: ", newStoredRecords)
        // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    }

    // const changedRecord = findChangedRecord(record

    // console.log(changedRecord)
    // YOUR CODE GOES HERE
    return (
        <div>
            <TablePickerSynced globalConfigKey="selectedTableId" />
            Hello world 🚀
        </div>);
}

initializeBlock(() => <Spellcheck />);
