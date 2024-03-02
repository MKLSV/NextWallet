"use client"

import { useEffect, useState } from "react";
import dbService from "../lib/db.service";
import Link from 'next/link'
import { PieChart } from "../components/PieChart";
import { Loader } from "../components/Loader";
import { AddModal } from "../components/addModal.jsx";

export default function HomeView() {
  const [wallet, setWallet] = useState({ wallet: 0, spendsCount: 0, incomesCount: 0 })
  const [incomes, setIncomes] = useState([])
  const [spends, setSpends] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    if (incomes.length && spends.length) {
      setLoader(false)
      return
    }
    const fetchData = async () => {

      const loadIncomes = await dbService.getData("Incomes")
      const loadSpends = await dbService.getData("Spends")
      console.log(loadIncomes)
      if (loadIncomes !== undefined) setIncomes(loadIncomes)
      if (loadSpends !== undefined) setSpends(loadSpends)
      setLoader(false)
    }
    fetchData()
  }, [])


  useEffect(() => {
    if (incomes.length && spends.length) {

      const incomesWallet = incomes.reduce((total, income) => total + parseInt(income.price), 0);
      const spendsWallet = spends.reduce((total, spend) => total + parseInt(spend.price), 0);
      const enlistedWallet = spends.reduce((total, spend) => total + parseInt(spend.enlisted), 0);
      setWallet({ wallet: incomesWallet - enlistedWallet, spendsCount: spendsWallet, incomesCount: incomesWallet })
    }
  }, [incomes, spends])


  function calculateProcent(type) {
    if (type === 'income') {
      if (wallet.incomesCount === 0) return '0%'
      return ((((wallet.incomesCount + wallet.spendsCount) / wallet.spendsCount) * 100) + "%")
    }
    else {
      if (wallet.spendsCount === 0) return '0%'
      return ((((wallet.incomesCount + wallet.spendsCount) / wallet.incomesCount) * 100) + "%")
    }
  }

  return (
    <div className="home-view">
      {loader ? <Loader /> : ''}
      {showModal === 'income' ? <AddModal setLoader={setLoader} setShowModal={setShowModal} showModal={showModal} setData={setIncomes} /> : ''}
      {showModal === 'spend' ? <AddModal setLoader={setLoader} setShowModal={setShowModal} showModal={showModal} setData={setSpends} /> : ''}
      <div className="app-header">
        <Link className='incomes' href='/incomes'>Доходы</Link>
        <Link className='spends' href='/spends'>Расходы</Link>
      </div>
      <PieChart incomesCount={wallet.incomesCount} spendsCount={wallet.enlistedWallet} />
      <div className="wallet-container">
        <span>Кошелек</span>
        <div className="wallet">
          <button className="add-income" onClick={() => (setShowModal('income'))}>+</button>
          <span>{wallet.wallet} P</span>
          <button className="add-spend" onClick={() => (setShowModal('spend'))}>+</button>
        </div>
        <div className="wallet-bar">
          {/* <div className="income-bar" ></div> */}
          <div className="income-bar" style={{ width: calculateProcent('income') }}></div>
          <div className="middle-bar"></div>
          {/* <div className="spend-bar" ></div> */}
          <div className="spend-bar" style={{ width: calculateProcent('spend') }}></div>
        </div>
      </div>
    </div>
  );
}

