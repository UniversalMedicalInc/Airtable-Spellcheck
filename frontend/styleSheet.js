
export default  {
    h1: {
        fontSize: 18,
        padding: 10,
        textAlign: "center",
        fontWeight: "bold",
        fontFamily: "'Courier New', monospace",
    },
    sentenceError: {
        color: "red",
        fontFamily: "'Courier New', monospace",
    },
    errorField: {
        border: '1px solid red',
        borderRadius: 2,
        backgroundColor: 'rgb(235, 235, 235)',
        margin: 5,
        padding: 5
    },
    errorFieldText: {
        color: "black",
        fontWeight: "bold",
        marginLeft: 5
    },
    statusDot: {
        border: '1px solid black',
        height: 12,
        width: 12,
        borderRadius: 6,
        display: "inline-block"
    },
    status: {
        notRun: {
            backgroundColor: "gold"
        },
        empty: {
            backgroundColor: "black"
        },
        networkError: {
            backgroundColor: "red"
        },
        emptyError: {
            backgroundColor: "black"
        },
        ok: {
            backgroundColor: "green"
        },
        okFixed: {
            backgroundColor: "green"
        },
        errorsDetected: {
            backgroundColor: "red"
        },
    },
    cellText: {
        margin: 5,
        border: '1px solid black',
        borderRadius: 2,
        backgroundColor: 'rgb(235, 235, 235)',
        padding: 5,
    },
    button: {
        margin: 1,
        border: 'none',
        padding: 3,
        borderRadius: 3,
        backgroundColor: 'lightgrey',
        boxShadow: '2px 2px'
    }

}