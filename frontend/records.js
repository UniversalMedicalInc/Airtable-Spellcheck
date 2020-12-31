let records = {}

export const setRecords = (newRecords) => {
    records = newRecords
}

export const getRecords = () => {
    return records
}

export const findChangedRecord = (currentRecords) => {
    let changedRecords = []
    // records.forEach((record, idx) => {
    //     if (record === currentRecords[idx]){
    //         changedRecords.push(record)
    //     }
    // })
}