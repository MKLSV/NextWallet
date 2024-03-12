'use client'

import Link from 'next/link'
import '../assets/main.scss';
import dbService from "../lib/db.service";
import { utilService } from "../lib/util.service";

import { RiHome3Line } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuMinusCircle } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [addModal, setAddModal] = useState(false)
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState({ title: '', price: '', date: '' })
  const [error, setError] = useState('')

  function handleChange(event) {
    console.log(event.target.id)
    const name = event.target.id
    const value = event.target.value
    setInput((prev) => ({ ...prev, [name]: value }))
  }

  async function onAddItem() {
    if (!input.title.length || !input.price.length || (!input.date.length && !checked)) {
      setError('Не хватает данных')
      return
    }
    else {
      let newItem = { ...input }
      if (addModal === 'spend') {
        if (checked) newItem.date = 'Не горит'
        await dbService.addData('Spends', newItem)
      }
      else {
        if (checked) newItem.date = utilService.getTodayDate()
        await dbService.addData('Incomes', newItem)
      }
      setError('')
      setInput({ title: '', price: '', date: '' })
      setAddModal(false)
      setChecked(false)
      console.log(newItem)
    }
  }

  return (
    <html lang="en">
      <body>
        {children}
        {addModal ?
          <div className='modal' onClick={() => setAddModal(false)}>
            <div className='modal-container' onClick={(e) => (e.stopPropagation())}>
              {addModal === 'spend' ?
                <span className='title'>Новый Расход</span>
                :
                <span className='title'>Новый Доход</span>
              }
              <div className="inputs">
                <section className='modal-section'>
                  <span className='title'>Название</span>
                  <input type="text" value={input.title} id='title' onChange={(e) => handleChange(e)} />
                </section>
                <section className='modal-section'>
                  <span className='title'>Сумма</span>
                  <input type="number" value={input.price} id='price' onChange={(e) => handleChange(e)} />
                </section>
                <section className='modal-section'>
                  <span className='title'>Число</span>
                  {checked ?
                    <input type="date" value={input.date} id='date' onChange={(e) => handleChange(e)} disabled />
                    :
                    <input type="date" value={input.date} id='date' onChange={(e) => handleChange(e)} />
                  }
                </section>
                <section className="check">
                  <input type="checkbox" className="checkbox" id="today" name="today" onClick={() => setChecked(!checked)} />
                  {addModal === 'spend'
                    ?
                    <label htmlFor="today">Не горит</label>
                    :
                    <label htmlFor="today">Сегодня</label>
                  }
                </section>
                <span>{error}</span>
              </div>
              <div className="add-footer">
                <span>Сохранить?</span>
                <div className="add-btns">
                  <IoClose onClick={() => setAddModal(false)} />
                  <FaCheck onClick={onAddItem} />
                </div>
              </div>
            </div>
          </div>
          : ''}
        <footer>
          <IoAddCircleOutline onClick={() => setAddModal('income')} />
          <Link className='home-icon' href='/'><RiHome3Line /></Link>
          <LuMinusCircle onClick={() => setAddModal('spend')} />
        </footer>
      </body>
    </html>
  );
}
