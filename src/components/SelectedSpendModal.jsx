import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import dbService from "../lib/db.service";

export function SelectedSpendModal({ setLoader, setSelectedSpend, selectedSpend, setSpends, spends }) {

    const [deleteModal, setDeleteModal] = useState(false)
    const [editItem, setEditItem] = useState(false)
    const [editedItem, setEditedItem] = useState({ ...selectedSpend })
    const [newEnliste, setNewEnliste] = useState(null)

    const spendsToUpdate = [...spends]

    function onEdit() {
        if (deleteModal) return
        setEditItem(true)
    }
    function handleChange(event) {
        console.log(event.target.id)
        const name = event.target.id
        const value = event.target.value
        setEditedItem((prev) => ({ ...prev, [name]: value }))
    }
    function handleEnliste(event) {
        const value = event.target.value
        if (value > parseInt(editedItem.price)) setNewEnliste(editedItem.price)
        else {
            setNewEnliste(parseInt(value))
        }
    }
    async function saveChanges(itemToSave = editedItem) {
        setEditItem(false)
        setLoader(true)
        console.log(itemToSave)
        await dbService.updateData(itemToSave, 'Spends')
        const updatedSpends = spendsToUpdate.map(spend =>
            spend._id === itemToSave._id ? { ...itemToSave } : spend
        );
        setSpends(updatedSpends)
        setLoader(false)
        setSelectedSpend(null)
    }
    async function deleteIncome() {
        setLoader(true)
        await dbService.removeData(selectedSpend._id, "Spends")
        const updatedSpends = spendsToUpdate.filter(spend => spend._id !== selectedSpend._id)
        setSpends(updatedSpends)
        setLoader(false)
        setSelectedSpend(null)
    }

    async function addNewEnliste() {
        const newEditedItem = { ...editedItem, enlisted: parseInt(editedItem.price), date: 'done', closeAt: Date.now()}
        setEditedItem(newEditedItem)
        saveChanges(newEditedItem)
    }
    console.log(editedItem)

    return (
        <div className="item-modal" onClick={() => setSelectedSpend(null)}>
            <div className="item-info" onClick={(e) => (e.stopPropagation())}>
                <div className="item">
                    <label>Источник</label>
                    {editItem ?
                        <input type="text" id="title" value={editedItem.title} onChange={(e) => handleChange(e)} />
                        :
                        <span>{editedItem.title}</span>
                    }
                </div>
                <div className="item">
                    <label>Сумма</label>
                    {editItem ?
                        <input type="text" id="price" value={editedItem.price} onChange={(e) => handleChange(e)} />
                        :
                        <span>{editedItem.price}</span>
                    }

                </div>
                {/* <div className="item">
                    <label>Уже зачисленно</label>
                    <span>{editedItem.enlisted}</span>
                </div> */}
                <div className="item">
                    <label>Число</label>
                    {editItem ?
                        <input type="date" id="date" value={editedItem.date} onChange={(e) => handleChange(e)} />
                        :
                        <span>{editedItem.date}</span>
                    }
                </div>

                <button className="add-spend-btn" onClick={addNewEnliste}>Выполнено</button>

                {editItem ?
                    <div className="btns">
                        <FaCheck className="set" style={{ color: 'green' }} onClick={saveChanges} />
                        <IoClose className="unset" style={{ color: 'red' }} onClick={() => setEditItem(false)} />
                    </div>
                    :
                    <div className={deleteModal ? "btns disabled" : "btns"}>
                        <RiDeleteBin5Line onClick={() => setDeleteModal(true)} />
                        <FaRegEdit onClick={onEdit} />
                    </div>
                }
                <div className={deleteModal ? "delete-modal active" : "delete-modal"}>
                    <span>ТОЧНО?</span>
                    <div className="delete-modal-btns">
                        <button className="yes" onClick={deleteIncome}>Ага</button>
                        <button className="no" onClick={() => setDeleteModal(false)}>Не</button>
                    </div>
                </div>
            </div>

        </div>
    )
}