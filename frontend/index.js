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
import React, { useState }from 'react';
import styles from './styleSheet'

import * as dictionary from './dictionary'

const removePunc = (cell) => {
    let string = cell
    let deletePunc = `";:,./[]{}<>?!@#$%^&*()~`
    let replacePunc = "'-\n"

    for (let i = 0; i < deletePunc.length; i++) {
        string = string.replaceAll(deletePunc[i], "")
    }
    for (let i = 0; i < replacePunc.length; i++) {
        string = string.replaceAll(replacePunc[i], " ")
    }
    string = string.replaceAll('  ', ' ')
    return string.split(' ')
}


function Spellcheck() {
    const [errors, setErrors] = useState([]);
    const [cell, setCell] = useState('');
    const [words, setWords] = useState([]);
    const [editedWords, setEditedWords] = useState({})
    const [ignored, setIgnored] = useState([])
    const [checkStatus, setCheckStatus] = useState("notRun")

    const [displaySettings, setDisplaySettings] = useState("none")

    const [replaceKey, setReplaceKey] = useState('')
    const [replaceValue, setReplaceValue] = useState(false)

    // inline-block
    const statusText = {
        notRun: "Spell Check Not Run",
        empty: "Nothing to check in this cell",
        networkError: "Network Error: Please insure that the airtable base URL and API keys are correct, and then refresh the App.",
        emptyError: "Nothing to check, please select a cell",
        ok: "Spell Check OK!",
        okFixed: "Spell Check OK! Errors Fixed.",
        errorsDetected: "Spell Check Run, Errors Detected."
    }


    const base = useBase();
    const globalConfig = useGlobalConfig();
    const table = base.getTableByName('Imported table');
    // const useDefault = false 
    const defaultFieldId = table.fields[0].id
    const defaultRecordId = useRecords(table)[0].id

    const allRecords = useRecords(table)
    const allFields = table.fields

    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds']);
    const fieldId = cursor.selectedFieldIds[0] || defaultFieldId
    const recordId = cursor.selectedRecordIds[0] || defaultRecordId
    const record = recordId ? useRecordById(table, recordId) : useRecords(table)[0]
    const currentCell = fieldId ? record.getCellValue(fieldId) : record.getCellValue("TL_ID")



    if (currentCell != cell) {
        setCell(currentCell)
        setErrors([])
        try {
            const currentWords = removePunc(currentCell)
            setWords(currentWords)
            setEditedWords({})
            setCheckStatus("notRun")
        } catch {
            setWords([])
            setEditedWords({})
            setCheckStatus("empty")
        }
    }

    // const field = watchedFields.includes(fieldId) ? cell : null;


    const updateRecord = (editedWords) => {
        let newCell = cell
        Object.entries(editedWords).forEach(([oldWord, newWord]) => {
            newCell = newCell.replaceAll(oldWord, newWord)
        })

        const fieldName = table.getFieldById(fieldId).name
        let newFieldData = {}
        newFieldData[fieldName] = newCell
        setIgnored([])
        table.updateRecordsAsync([
            { id: recordId, fields: newFieldData },
        ]);

    }

    let sentence = words.map((word, idx) => {
        if (Object.keys(errors).includes(word)) {
            return <u key={`sentence${idx}`} style={styles.sentenceError}>{word} </u>
        } else {
            return <span key={`sentence${idx}`}>{word} </span>
        }
    })

    const runSpellcheck = async() => {
        try{
            let newWords = []
            
            words.forEach((oldWord, idx) =>{
                if (editedWords[oldWord]) {
                    if (editedWords[oldWord].includes(' ')){
                        editedWords[oldWord].split(' ').forEach((newWord) => {
                            newWords.push(newWord)
                        })
                    } else {
                        let newWord = editedWords[oldWord]
                        newWords.push(newWord)
                    }
                } else {
                    newWords.push(oldWord)
                }
            })
            


            setWords(newWords)
            const newErrors = await dictionary.checkSpelling(newWords)
            Object.keys(newErrors).forEach((error) => {
                if (ignored.includes(error)) {
                    newErrors[error] = undefined
                }
            })
            setErrors(newErrors)
            if (Object.values(newErrors).length === 0) {
                setCheckStatus("ok")
                if (Object.entries(editedWords).length > 0) {
                    await updateRecord(editedWords)
                    setCheckStatus("okFixed")
                }
            } else {
                setCheckStatus("errorsDetected")
            }
        } catch(error) {
                console.log(error)
                if (error.message === "Network Error") {
                    setCheckStatus("networkError")
                    setDisplaySettings(true)
                }else {
                    setCheckStatus("emptyError")
                }
        }
    }

    const addToDictionary = async (error) => {
        await dictionary.addToDictionary(error)
        const newErrors = await dictionary.checkSpelling(words)
        setErrors(newErrors)
    }
    
    const findAndReplace = async(key, value, type) => {
        const fieldIds = cursor.selectedFieldIds
        const recordIds = cursor.selectedRecordIds
        let selectedRecords = allRecords
        let selectedFields = allFields


        if (type === "selected"){
            selectedRecords = allRecords.filter((record) => recordIds.includes(record.id))
            selectedFields = allFields.filter((field) => { return fieldIds.includes(field.id)})
        }
        let totalRecords = selectedRecords.length
        selectedRecords.forEach((record, rIdx) => {
            let newFieldData = {}
            console.log(rIdx, "/", totalRecords)
            selectedFields.forEach((field) => {
                const fieldId = field.id
                
                let cellVal = record.getCellValue(fieldId)
                if(cellVal){
                    if (cellVal.includes(key)){
                        const fieldName = table.getFieldById(fieldId).name
                        cellVal = cellVal.replaceAll(key, value)
                        newFieldData[fieldName] = cellVal
                    }
                }
            })
        //     if (Object.keys(newFieldData).length > 0)
        //     table.updateRecordsAsync([
        //         { id: record.id, fields: newFieldData },
        //     ]);
        // })
    }

    return (
        <div>
            <button onClick={() => {setDisplaySettings(!displaySettings)}}>Settings</button>
            <input
                style={{ display: displaySettings ? "none" : "inline-block" }}
                type="text"
                onChange={(e) => {
                    globalConfig.setAsync('baseURL', e.currentTarget.value);
                }}
                placeholder="Base URL"
            />
            <input
                style={{ display: displaySettings ? "none" : "inline-block" }}
                type="text"
                onChange={(e) => {
                    globalConfig.setAsync('key', e.currentTarget.value);
                }}
                placeholder="Key"
            />
            <h1 style={styles.h1Options[checkStatus]}>{statusText[checkStatus]}</h1>
            <p>{sentence}</p>
            <div>{Object.entries(errors).map(([error, idx]) => {
                if( ignored.includes(error)) {return null}
                return (<div key={idx} style={styles.errorField}>
                    <div style={styles.errorFieldText}>{error}: </div>
                    <input 
                        type="text"
                        onChange={(e) => {
                            setEditedWords({...editedWords, [error]: e.currentTarget.value})
                        }}
                        placeholder="correct"
                    />
                    <button onClick={() => {addToDictionary(error)}}>Add To Dictionary</button>
                    <button onClick={() => {
                        let newIgnore = ignored
                        newIgnore.push(error)
                        setIgnored(newIgnore)
                    }}>Ignore</button>
                    <button onClick={() => {findAndReplace(error, editedWords[error])}}>Replace All</button>
                    <br />
                </div>)
            })}</div>
            <button onClick={()=> { runSpellcheck()}}>Spell Check</button>
            <br/>
            <br/>
            <br/>

            <input
                type="text"
                onChange={(e) => {
                    setReplaceKey(e.currentTarget.value);
                }}
                placeholder="Find"
            />
            <input
                type="text"
                onChange={(e) => {
                    setReplaceValue(e.currentTarget.value);
                }}
                placeholder="Replace"
            />

            <button onClick={() => {

                findAndReplace(replaceKey, replaceValue, 'selected')
            }}>Replace</button>
        </div>);
}



initializeBlock(() => <Spellcheck />);
