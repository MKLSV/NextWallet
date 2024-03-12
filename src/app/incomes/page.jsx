'use client'

import { useEffect, useState } from "react"
import dbService from "../../lib/db.service"
import { Loader } from "../../cmps/Loader"
import { SelectedIncomeModal } from "./SelectedIncomeModal";

export default function IncomesView() {
    const [selectedIncome, setSelectedIncome] = useState(null)
    const [incomesList, setIncomesList] = useState([])
    const [loader, setLoader] = useState(true)
    const [incomes, setIncomes] = useState([])

    useEffect(() => {
        if (incomes.length) {
            getincomesList()
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
        getincomesList()
    }, [incomes])

    function getincomesList() {
        const sortedData = incomes.reduce((acc, item) => {
            const date = new Date(item.date);
            const monthName = date.toLocaleString('ru-RU', { month: 'long' });

            if (!acc[monthName]) {
                acc[monthName] = { name: monthName, items: [] };
            }

            acc[monthName].items.push(item);

            return acc;
        }, {});
        const sortedDataArray = Object.values(sortedData);
        setIncomesList(sortedDataArray)
    }
    function getMonthWallet(arr) {
        const wallet = arr.items.reduce((total, { price }) => total + parseInt(price), 0)
        return wallet
    }

    function formatDate(inputDate) {
        const [year, month, day] = inputDate.split('-');
        const formattedYear = year.slice(-2);
        return `${day}.${month}.${formattedYear}`;
    }

    function onSelectedIncome(id) {
        const selected = incomes.find(item => item._id === id)
        setSelectedIncome(selected)
    }

    if (loader) return <Loader />
    return (
        <div className="wallet-info">
            {selectedIncome? <SelectedIncomeModal setLoader={setLoader} selectedIncome={selectedIncome} setSelectedIncome={setSelectedIncome} incomes={incomes} setIncomes={setIncomes}/> : ''}
            <header>Доходы</header>
            <div className="wallet-list">
                {incomesList.map(monthItems =>
                    <div className="list" key={monthItems.name}>
                        <div className="header">
                            <span className="month-name">{monthItems.name}</span>
                            <span>{getMonthWallet(monthItems)}р</span>
                        </div>
                        {monthItems.items.map(item => (
                            <div className="item-container" key={item._id}>
                                <div className="item" onClick={() => onSelectedIncome(item._id)}>
                                    <span>{item.title}</span>
                                    <span className="date">{formatDate(item.date)}</span>
                                    <span className="spend">{item.price}p</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}