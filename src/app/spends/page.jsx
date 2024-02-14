"use client"

import { useEffect, useState } from "react";
import Link from 'next/link'
import { IoArrowBackOutline } from "react-icons/io5";

import dbService from "../../lib/db.service";
import { Loader } from "../../components/Loader";
import { SelectedSpendModal } from "../../components/SelectedSpendModal";

export default function SpendsView() {
    const [spendWallet, setSpendWallet] = useState(0)
    const [enlistedWallet, setEnlistedWallet] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [selectedSpend, setSelectedSpend] = useState(null)
    const [loader, setLoader] = useState(true)
    const [spendList, setSpendList] = useState(null)

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
        const newWallet = spends.reduce((total, spend) => total + parseInt(spend.price), 0);
        const newEnlistedWallet = spends.reduce((total, spend) => total + parseInt(spend.enlisted), 0);
        setSpendWallet(newWallet - newEnlistedWallet)
        setEnlistedWallet(newEnlistedWallet)
    }, [spends])

    function getSortedSpends() {
        let highPriority = []
        let mediumPriority = []
        let lowPriority = []
        let noPriority = []
        let done = []
        let check
        
        spends.map((item) => {
            check = checkPriority(item.date)
            if (check === 'high') highPriority.push(item)
            if (check === 'medium') mediumPriority.push(item)
            if (check === 'low') lowPriority.push(item)
            if (check === 'no') noPriority.push(item)
            if (check === 'done') done.push(item)
        })
        highPriority.sort(function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        mediumPriority.sort(function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        lowPriority.sort(function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setSpendList({ high: highPriority, medium: mediumPriority, low: lowPriority, done: done, no: noPriority })
    }

    function onSelectedSpend(id) {
        const selected = spends.find(item => item._id === id)
        console.log(selected)
        setSelectedSpend(selected)
    }

    function checkPriority(date) {
        const diff = new Date(date).getTime() - Date.now()
        // console.log(date)
        if (diff < 604800000) return 'high'
        if (diff < 604800000 * 2) return 'medium'
        if (date === 'Не горит') return 'no'
        if (date === 'done') return 'done'
        return 'low'
    }


    return (
        <div className="list-container">
            {loader ? <Loader /> : ''}
            {selectedSpend ? <SelectedSpendModal setLoader={setLoader} selectedSpend={selectedSpend} setSelectedSpend={setSelectedSpend} spends={spends} setSpends={setSpends}/> : ''}
            <div className="header spend">
                <div className="title">
                    <Link className='back' href='/'><IoArrowBackOutline /></Link>
                </div>
                <div className="wallet">
                    <section>
                        <span>Расходы: </span>
                        <span>{spendWallet} P</span>
                    </section>
                    <section>
                        <span>Внесено: </span>
                        <span>{enlistedWallet} P</span>
                    </section>
                </div>
            </div>
            {spendList !== null ?
                <div className="list-group" >
                    {spendList.high.length > 0 && 
                    <span className="list-title high">Высокий приоритет</span>
                    }
                    {spendList.high.map((item, index) => (
                        <div className='list-item' key={index} onClick={() => onSelectedSpend(item._id)}>
                            <span className="item">{item.title}</span>
                            <span className="item">{item.price}p</span>
                        </div>
                    ))}
                    {spendList.medium.length > 0 && 
                    <span className="list-title medium">Средний приоритет</span>
                    }
                    {spendList.medium.map((item, index) => (
                        <div className='list-item' key={index} onClick={() => onSelectedSpend(item._id)}>
                            <span className="item">{item.title}</span>
                            <span className="item">{item.price}p</span>
                        </div>
                    ))}
                    {spendList.low.length > 0 && 
                    <span className="list-title low">Терпит</span>
                    }
                    {spendList.low.map((item, index) => (
                        <div className='list-item' key={index} onClick={() => onSelectedSpend(item._id)}>
                            <span className="item">{item.title}</span>
                            <span className="item">{item.price}p</span>
                        </div>
                    ))}
                    {spendList.no.length > 0 && 
                    <span className="list-title no">Вообще не горит</span>
                    }
                    {spendList.no.map((item, index) => (
                        <div className='list-item' key={index} onClick={() => onSelectedSpend(item._id)}>
                            <span className="item">{item.title}</span>
                            <span className="item">{item.price}p</span>
                        </div>
                    ))}
                    {spendList.done.length > 0 && 
                    <span className="list-title done">Уже оплаченно</span>
                    }
                    {spendList.done.map((item, index) => (
                        <div className='list-item done' key={index} onClick={() => onSelectedSpend(item._id)}>
                            <span className="item">{item.title}</span>
                            <span className="item">{item.price}p</span>
                        </div>
                    ))}
                </div>
                : ''}
        </div>
    )
}