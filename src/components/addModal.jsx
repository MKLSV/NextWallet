import { useState } from "react";
import dbService from "../lib/db.service";
import { utilService } from "../lib/util.service";


export function AddModal({ setLoader, setShowModal, showModal, setData }) {

    const [error, setError] = useState('')
    const [checked, setChecked] = useState(false)

    async function onAddItem(e) {
        e.preventDefault()
        if (showModal === 'income') {

            if (!e.target[0].value.length || !e.target[1].value.length || (!e.target[2].value.length && !checked)) {
                setError('Не хватает данных')
                return
            }
            else {
                const data = {
                    title: e.target[0].value,
                    price: e.target[1].value,
                    date: checked ? utilService.getTodayDate() : e.target[2].value
                }
                setLoader(true)
                await dbService.addData('Incomes', data)
                setData((prev) => [...prev, data])
            }
        } else {
            if (!e.target[0].value.length || !e.target[1].value.length || (!e.target[2].value.length && !checked)) {
                setError('Не хватает данных')
                return
            }
            else {
                setLoader(true)
                const data = {
                    enlisted: 0,
                    title: e.target[0].value,
                    price: e.target[1].value,
                    date: checked ? 'Не горит' : e.target[2].value
                }
                await dbService.addData('Spends', data)
                setData((prev) => [...prev, data])
            }
        }
        setShowModal(false)
        setLoader(false)
    }


    return (
        <div className="add-modal" onClick={() => setShowModal(false)}>
            {showModal === 'income' ?
                <form className="add-form" onSubmit={onAddItem} onClick={(e) => (e.stopPropagation())}>
                    <input type="text" className="form-control" placeholder="Источник" />
                    <span className="input-group-text"></span>
                    <input type="number" className="form-control" placeholder="Сумма" />
                    {!checked ?
                        <input type="date" className="form-control" />
                        :
                        <input type="date" className="form-control disabled" disabled />
                    }
                    <section className="check">
                        <input type="checkbox" className="checkbox" id="today" name="today" onClick={() => setChecked(!checked)} />
                        <label htmlFor="today">Сегодня</label>
                    </section>
                    <button type="submit" className="btn btn-primary">Добавить</button>
                    <div className="error">{error}</div>
                </form>
                :
                <form className="add-form" onSubmit={onAddItem} onClick={(e) => (e.stopPropagation())}>
                    {/* <span className="close-btn"><IoClose/></span> */}
                    <input type="text" className="form-control" placeholder="Трата" />
                    <span className="input-group-text"></span>
                    <input type="number" className="form-control" placeholder="Сумма" />
                    {/* <section>
                        <label htmlFor="priority">Приоритет</label>
                        <select name="priority" className="priority">
                            <option value="high" >Высокий</option>
                            <option value="medium">Средний</option>
                            <option value="low" selected="selected">Низкий</option>
                        </select>
                    </section> */}
                    {!checked ?
                        <input type="date" className="form-control" />
                        :
                        <input type="date" className="form-control disabled" disabled />
                    }
                    <section className="check">
                        <input type="checkbox" className="checkbox" id="today" name="today" onClick={() => setChecked(!checked)} />
                        <label htmlFor="today">Не горит</label>
                    </section>
                    <button type="submit" className="btn btn-primary">Добавить</button>
                    <div className="error">{error}</div>
                </form>
            }
        </div>
    )
}
