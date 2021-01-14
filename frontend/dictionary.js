import axiosInstance from './api/axiosInstance'

export const checkSpelling = async(words) => {
    let filterByFormula = '?filterByFormula=OR('
    words.forEach(word => {
        const filterSection = `{word}='${word.toLowerCase()}', `
        filterByFormula += filterSection
    });
    filterByFormula = filterByFormula.slice(0, -2)
    filterByFormula+= ")"
    const res = await axiosInstance.get(filterByFormula)
    try {   
        let results = res.data.records.map((record) => { return (record.fields.word)})
        const errors = {}

        words.forEach((word, idx) => {
            if (!results.includes(word.toLowerCase())) {
                errors[word] = idx
            }
        })

        return errors
    } catch {
        return null
    }
}

export const addToDictionary = async(word) => {
    await axiosInstance.post('', {
        "records": [
            {
                "fields": {
                    "word": word.toLowerCase()
                }
            }
        ]
    })
}
