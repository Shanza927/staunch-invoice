import {  } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import content from '../src/assets/Content.svg'

import InvoiceForm from './components/InvoiceForm'

function App() {

  return (
    <div className=' p-4 pb-5 pt-0'>
      <div className='header d-flex align-items-center w-100 justify-content-center'>
        <img src={content}/>
      </div>
   <InvoiceForm/>
    </div>
  )
}

export default App
