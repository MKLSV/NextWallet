'use client'

import { useEffect, useState } from "react";
import dbService from "../../lib/db.service";
import { SelectedSpendModal } from "./SelectedSpendModal";
import { Loader } from "../../cmps/Loader";


export default function SpendsView() {
    const [selectedSpend, setSelectedSpend] = useState(null)
    const [loader, setLoader] = useState(true)
    const [spendList, setSpendList] = useState(null)
    const [spendWallet, setSpendWallet] = useState({ high: 0, medium: 0, low: 0, done: 0 })
    const [spends, setSpends] = useState([])
    console.log(spendList)

    useEffect(() => {
        if (spends.length) {
            getSortedSpends()
            setLoader(false)
            return
        }
        const fetchData = async () => {
            const loadSpends = await dbService.getData("Spends")
            setSpends(loadSpends)
            setLoader(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        getSortedSpends()
    }, [spends])

    function getSortedSpends() {
        let highPriority = []
        let mediumPriority = []
        let lowPriority = []
        let done = []
        let check
        // let noPriority = []

        spends.map((item) => {
            check = checkPriority(item.date)
            if (check === 'high') highPriority.push(item)
            if (check === 'medium') mediumPriority.push(item)
            if (check === 'low') lowPriority.push(item)
            if (check === 'done') done.push(item)
            // if (check === 'no') noPriority.push(item)
        })
        highPriority.sort(function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        mediumPriority.sort(function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        lowPriority.sort(function (a, b) {
            if (a.date === 'Не горит' && b.date !== 'Не горит') {
                return 1; // 'Не горит' goes to the back
            } else if (a.date !== 'Не горит' && b.date === 'Не горит') {
                return -1; // 'Не горит' goes to the front
            } else {
                // Sort by date if both are dates or both are not 'Не горит'
                const dateA = a.date === 'Не горит' ? Infinity : new Date(a.date).getTime();
                const dateB = b.date === 'Не горит' ? Infinity : new Date(b.date).getTime();
                return dateA - dateB;
            }
        });
        const highWallet = highPriority.reduce((total, { price }) => total + parseInt(price), 0);
        const mediumWallet = mediumPriority.reduce((total, { price }) => total + parseInt(price), 0);
        const lowWallet = lowPriority.reduce((total, { price }) => total + parseInt(price), 0);
        const doneWallet = lowPriority.reduce((total, { price }) => total + parseInt(price), 0);

        setSpendList({ high: highPriority, medium: mediumPriority, low: lowPriority, done: done })
        setSpendWallet({ high: highWallet, medium: mediumWallet, low: lowWallet, done: doneWallet })
    }

    function onSelectedSpend(id) {
        const selected = spends.find(item => item._id === id)
        console.log(selected)
        setSelectedSpend(selected)
    }

    function checkPriority(date) {
        const diff = new Date(date).getTime() - Date.now()
        // console.log(date)
        if (date === 'done') return 'done'
        if (diff < 604800000) return 'high'
        if (diff < 604800000 * 2) return 'medium'
        // if (date === 'Не горит') return 'no'
        return 'low'
    }
    function formatDate(inputDate) {
        if(inputDate === 'Не горит') return 'Не горит'
        if(inputDate === 'done') return 
        const [year, month, day] = inputDate.split('-');
        const formattedYear = year.slice(-2);
        return `${day}.${month}.${formattedYear}`;
    }

    if(loader) return <Loader/>

    return (
        <div className="wallet-info">
             {selectedSpend ? <SelectedSpendModal setLoader={setLoader} selectedSpend={selectedSpend} setSelectedSpend={setSelectedSpend} spends={spends} setSpends={setSpends}/> : ''}
            <header>Расходы</header>
            <div className="wallet-list">
                <div className="list">
                    <div className="header red">
                        <span>Срочно</span>
                        <span>{spendWallet.high}р</span>
                    </div>
                    {spendList.high.map(item => (
                        <div className="item-container">
                            <div className="item" onClick={() => onSelectedSpend(item._id)}>
                                <span>{item.title}</span>
                                <span className="date">{formatDate(item.date)}</span>
                                <span className="spend">{item.price}p</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="list">
                    <div className="header orange">
                        <span>Терпит</span>
                        <span>{spendWallet.medium}р</span>
                    </div>
                    {spendList.medium.map(item => (
                        <div className="item-container">
                            <div className="item" onClick={() => onSelectedSpend(item._id)}>
                                <span>{item.title}</span>
                                <span className="date">{formatDate(item.date)}</span>
                                <span className="spend">{item.price}p</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="list">
                    <div className="header green">
                        <span>Не горит</span>
                        <span>{spendWallet.low}р</span>
                    </div>
                    {spendList.low.map(item => (
                        <div className="item-container">
                            <div className="item" onClick={() => onSelectedSpend(item._id)}>
                                <span>{item.title}</span>
                                <span className="date">{formatDate(item.date)}</span>
                                <span className="spend">{item.price}p</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="list">
                    <div className="header grey">
                        <span>Оплачено</span>
                        <span>{spendWallet.done}р</span>
                    </div>
                    {spendList.done.map(item => (
                        <div className="item-container">
                            <div className="item" onClick={() => onSelectedSpend(item._id)}>
                                <span>{item.title}</span>
                                <span className="date">{formatDate(item.date)}</span>
                                <span className="spend">{item.price}p</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}