import './App.css';
import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import usePromise from 'react-promise';
import QRScan from './119444409-c6367d00-bd5d-11eb-8881-6cba01cc0d5e.png';

const QR = () => {
  const {value, loading} = usePromise(promise)

  if (loading) return null
  return (<QRCodeSVG
            level="Q"
            style={{ width: 256 }}
          value={JSON.stringify(value.json)}
          />)
}

//define new promise as http request
const promise = new Promise((resolve) => {
  fetch('http://localhost:3000/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "ID":483939
    })
  })
  .then(res => res.json())
  .then(json => {
    console.log(json)
    resolve({json})
  })
})

function App() {

  const [value, setValue] = React.useState('')
  const [confirmation, setConfirmation] = React.useState(true)
  const sendConfirmation = async () => {

    fetch('http://localhost:3000/confirm', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "ID":483939
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      setValue(json.balance)
      setConfirmation(false)
    })
  }

  return (
    <div style={styles.root}>
      <h1 style={styles.h1}>QRCode with JSON</h1>
      <div style={styles.qrcode}>
        <QR/>
      </div>
      <div onClick={() => {sendConfirmation()}} style={styles.qrcode}>
        <img src={ QRScan } alt='scan' style={styles.qrScan}/>
        {confirmation ? <h3></h3> : <h3>Balance: {JSON.stringify(value)}</h3>}
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
    width: '20%',
    height: '20%',
  },
};