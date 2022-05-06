import './App.css';
import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import usePromise from 'react-promise';
import QRScan from './119444409-c6367d00-bd5d-11eb-8881-6cba01cc0d5e.png';


const USERID = 483939
//define new promise as http request
const promise = new Promise((resolve) => {
  fetch('http://localhost:3000/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "ID":USERID
    })
  })
  .then(res => res.json())
  .then(json => {
    resolve({json})
  })
})

function App() {

  const [terminal, setTerminal] = React.useState('')
  const [willPass, setWillPass] = React.useState(false)
  const [confirmation, setConfirmation] = React.useState(true)
 
  const sendConfirmation = async () => {
    if(willPass){

    fetch('http://localhost:3000/confirm', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "ID":USERID
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
    setTimeout(() => setTerminal(json.balance), 0);
    setTimeout(() => setConfirmation(false), 0);
    })
  }else{
    setTimeout(() => setTerminal('Saldo insuficiente'), 0);
    setTimeout(() => setConfirmation(true), 0);
    }
  }

  const QR = () => {
    const {value, loading} = usePromise(promise)
  
    if (loading) {return null}
    else{
    
    
    setTimeout(() => setWillPass(value.json.willPass), 0);
    
    console.log(value.json)

    return (<QRCodeSVG
              level="Q"
              style={{ width: 256 }}
            value={JSON.stringify(value.json)}
            />)}
  }

  return (
    <div style={styles.root}>
      <h1 style={styles.h1}>QRCode with JSON</h1>
      <div style={styles.qrcode}>
        <QR/>
      </div>
      <div onClick={() => {sendConfirmation()}} style={styles.qrcode}>
        <img src={ QRScan } alt='scan' style={styles.qrScan}/>
        {confirmation ? 
         <h3 style={styles.red}>{!willPass && terminal}</h3> :
         <h3 style={styles.green}>Balance: {JSON.stringify(terminal)}</h3>}
      </div>
    </div>
  );
}

export default App;

const styles = {
  root: {
    fontFamily: 'sans-serif',
  },
  h1: {
    textAlign: 'center',
  },
  qrcode: {
    textAlign: 'center',
  },
  qrScan: {
    margin: 'auto',
    display: 'block',
    width: '250px',
    height: '200px',
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
    
};