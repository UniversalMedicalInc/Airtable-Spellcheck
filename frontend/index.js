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
import React, { useState }from 'react';

import axiosInstance from './api/axiosInstance'

import * as dictionary from './dictionary'


const removePunc = (wordsArr, setRemovedPunc) => {
    const punctuation = '!.,/()[]{}-_`,~;:?'
    let puncFreeWordsArr = []
    let newRemovedPunc = {}
    wordsArr.forEach((word, idx) => {
        if (punctuation.includes(word[word.length - 1])) {
            newRemovedPunc[idx] = word[word.length - 1]
            puncFreeWordsArr.push(word.slice(0, -1))
        } else {
            puncFreeWordsArr.push(word)
        }
    })
    setRemovedPunc(newRemovedPunc)
    
    return puncFreeWordsArr
}

const returnPunc = () => {

}

function Spellcheck() {
    const [errors, setErrors] = useState([]);
    const [cell, setCell] = useState('');
    const [words, setWords] = useState([]);
    const [editedWords, setEditedWords] = useState({})
    const [removedPunc, setRemovedPunc] = useState({})

    



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

    const currentCell = fieldId ? record.getCellValue(fieldId) : record.getCellValue("TL_ID")



    if (currentCell != cell) {
        setCell(currentCell)
        setErrors([])
        try {
            const currentWords = currentCell.split(' ')
            setWords(currentWords)
        } catch {
            setWords([])
        }
    }

    const field = watchedFields.includes(fieldId) ? cell : null;

    const updateRecord = (data) => {
        const fieldName = table.getFieldById(fieldId).name
        let newFieldData = {}
        newFieldData[fieldName] = data.join(' ')
        table.updateRecordsAsync([
            { id: recordId, fields: newFieldData },
        ]);
    }

    let sentence = words.map((word, idx) => {
        if (Object.keys(errors).includes(word)) {
            return <u key={`sentence${idx}`}>{word} </u>
        } else {
            return <span key={`sentence${idx}`}>{word} </span>
        }
    })



    return (
        <div>
            <p>{sentence}</p>
            <div>{Object.entries(errors).map(([error, idx]) => {
                return (<div key={idx} >
                    {error}: <input
                        type="text"
                        onChange={(e) => {
                            setEditedWords({...editedWords, [idx]: e.currentTarget.value})
                        }}
                        placeholder="correct"
                    />
                    <button onClick={
                        async () => {
                            await dictionary.addToDictionary(error)
                            const newErrors = await dictionary.checkSpelling(words)
                            setErrors(newErrors)
                        }
                    }>Add To Dictionary</button>
                    <br />
                </div>)
            })}</div>
            <button onClick={async()=> {
                let newWords = words
                Object.entries(editedWords).forEach(([idx, word]) => {
                    newWords[idx] = word
                })
                setWords(newWords)
                const newErrors = await dictionary.checkSpelling(words)
                setErrors(newErrors)
                if (Object.values(newErrors).length === 0){
                    updateRecord(words)
                }
            }}>Spell Check</button>
        </div>);
}



initializeBlock(() => <Spellcheck />);
