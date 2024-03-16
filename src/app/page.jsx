'use client'
import Link from 'next/link'
import dbService from "../lib/db.service";
import { Loader } from "../cmps/Loader";
import { useEffect, useState } from 'react';
// import './home.scss';

export default function Home() {

  const [loader, setLoader] = useState(true)
  const [incomes, setIncomes] = useState([])
  const [spends, setSpends] = useState([])
  const [spendsList, setSpendsList] = useState({ high: 0, medium: 0, low: 0 })
  const [incomeWallet, setIncomeWallet] = useState(0)
  const date = new Date();
  const shortMonthName = date.toLocaleString('ru-RU', { month: 'short' });

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
      setLoader(false)
      const currentMonth = new Date().getMonth() + 1;
      const itemsThisMonth = incomes
        .map(income => {
          const [year, month, day] = income.date.split('-').map(Number);
          return { ...income, month };
        })
        .filter(({ month }) => month === currentMonth);
      console.log(itemsThisMonth);
      const incomesThisMonth = itemsThisMonth.reduce(
        (total, { price }) => total + parseInt(price), 0
      );
      setIncomeWallet(incomesThisMonth);
      getSortedSpends()
    }
  }, [incomes, spends]);


  function getSortedSpends() {
    let highPriority = []
    let mediumPriority = []
    let lowPriority = []
    let check

    spends.map((item) => {
      check = checkPriority(item.date)
      if (check === 'high') highPriority.push(item)
      if (check === 'medium') mediumPriority.push(item)
      if (check === 'low') lowPriority.push(item)
    })
    const high = highPriority.reduce((total, { price }) => total + parseInt(price), 0);
    const medium = mediumPriority.reduce((total, { price }) => total + parseInt(price), 0);
    const low = lowPriority.reduce((total, { price }) => total + parseInt(price), 0);
    setSpendsList({ high, medium, low })
  }

  function checkPriority(date) {
    const diff = new Date(date).getTime() - Date.now()
    if (diff < 604800000) return 'high'
    if (diff < 604800000 * 2) return 'medium'
    if (date === 'Не горит') return 'no'
    if (date === 'done') return 'done'
    return 'low'
  }

  if (loader) return <Loader />

  return (
    <main className="app">
      <header>
        <span>WalletApp</span>
      </header>
      <div className="home-container">

        <div className="home-incomes">
          <Link href='/incomes' className="link-btn">Доходы</Link>
          <div className="incomes-info">
            <span className="month">
              {shortMonthName}
            </span>
            <span className="month-incomes">
              {incomeWallet}p
            </span>
          </div>
        </div>

        <div className="home-spends">
          <Link href='/spends' className="link-btn">Расходы</Link>
          <div className="spends-list">
            <div className="spend-info">
              <span className="type red">Срочно</span>
              <span className="spend">{spendsList.high}р</span>
            </div>
            <div className="spend-info">
              <span className="type orange">Терпит</span>
              <span className="spend">{spendsList.medium}р</span>
            </div>
            <div className="spend-info">
              <span className="type green">Не горит</span>
              <span className="spend">{spendsList.low}р</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
