"use client"

import { useEffect, useState } from "react";
import Link from 'next/link'
import { IoArrowBackOutline } from "react-icons/io5";
import dbService from "../../lib/db.service";
import { Loader } from "../../components/Loader";
import { SelectedIncomeModal } from "../../components/SelectedIncomeModal";

export default function IncomesView() {
  const [incomeWallet, setIncomeWallet] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedIncome, setSelectedIncome] = useState(null)
  const [loader, setLoader] = useState(true)
  const [incomes, setIncomes] = useState([])


  useEffect(() => {
    if (incomes.length) {
      setLoader(false)
      return
    }
    const fetchData = async () => {
      const loadIncomes = await dbService.getData("Incomes")
      setIncomes(loadIncomes)
      setLoader(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (incomes.length) {
      const newWallet = incomes.reduce((total, income) => total + parseInt(income.price), 0);
      setIncomeWallet(newWallet)
    }
  }, [incomes])

  function onSelectedIncome(id) {
    const selected = incomes.find(item => item._id === id)
    setSelectedIncome(selected)
  }


  return (
    <div className="list-container">
      {loader ? <Loader /> : ''}
      {selectedIncome ? <SelectedIncomeModal setLoader={setLoader} selectedIncome={selectedIncome} setSelectedIncome={setSelectedIncome} incomes={incomes} setIncomes={setIncomes} /> : ''}
      <div className="header">
        <div className="title">
          <Link className='back' href='/'><IoArrowBackOutline /></Link>
        </div>
        <div className="wallet">
          <span>Доходы: </span>
          <span>{incomeWallet} P</span>
        </div>
      </div>
      {incomes && incomes.length ?
        <div className="list-group" >
          {incomes.map((item, index) => (
            <div className="list-item" key={index} onClick={() => onSelectedIncome(item._id)}>
              <span className="item">{item.title}</span>
              <span className="item">{item.price}p</span>
            </div>
          ))}
          {/* <button onClick={() => setShowModal(true)}>Добавить</button> */}
        </div>
        :
        <div className="add-btn" onClick={() => setShowModal(true)}>
          <span>+</span>
        </div>
      }
    </div>
  )
}