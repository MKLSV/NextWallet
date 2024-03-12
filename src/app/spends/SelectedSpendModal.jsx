import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6"
import { FaRegPenToSquare } from "react-icons/fa6"
import dbService from "../../lib/db.service";

export function SelectedSpendModal({ setLoader, setSelectedSpend, selectedSpend, setSpends, spends }) {

    const [deleteItem, setDeleteItem] = useState(false)
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

    async function saveChanges(itemToSave, type) {
        setEditItem(false)
        setLoader(true)
        if (type === 'enliste') {
            await dbService.updateData(itemToSave, 'Spends')
            const updatedSpends = spendsToUpdate.map(spend =>
                spend._id === itemToSave._id ? { ...itemToSave } : spend
            );
            setSpends(updatedSpends)
        } else {
            await dbService.updateData(editedItem, 'Spends')
            const updatedSpends = spendsToUpdate.map(spend =>
                spend._id === editedItem._id ? { ...editedItem } : spend
            );
            setSpends(updatedSpends)
        }
        setLoader(false)
        setSelectedSpend(null)
    }
    async function deleteSpend() {
        setLoader(true)
        await dbService.removeData(selectedSpend._id, "Spends")
        const updatedSpends = spendsToUpdate.filter(spend => spend._id !== selectedSpend._id)
        setSpends(updatedSpends)
        setLoader(false)
        setSelectedSpend(null)
    }

    async function addNewEnliste() {
        const newEditedItem = { ...editedItem, enlisted: parseInt(editedItem.price), date: 'done', closeAt: Date.now() }
        setEditedItem(newEditedItem)
        saveChanges(newEditedItem, 'enliste')
    }
    console.log(editedItem)

    return (
        <div className="modal" onClick={() => setSelectedSpend(null)}>
            <div className="modal-container" onClick={(e) => (e.stopPropagation())}>
                <div className={!editItem ? "modal-section edit" : "modal-section"}>
                    <span className="title">Название</span>
                    {editItem ?
                        <input type="text" id="title" value={editedItem.title} onChange={(e) => handleChange(e)} />
                        :
                        <span className="value">{editedItem.title}</span>
                    }
                </div>
                <div className={!editItem ? "modal-section edit" : "modal-section"}>
                    <span className="title">Сумма</span>
                    {editItem ?
                        <input type="text" id="price" value={editedItem.price} onChange={(e) => handleChange(e)} />
                        :
                        <span className="value">{editedItem.price}</span>
                    }

                </div>
                <div className={!editItem ? "modal-section edit" : "modal-section"}>
                    <span className="title">Число</span>
                    {editItem ?
                        <input type="date" id="date" value={editedItem.date} onChange={(e) => handleChange(e)} />
                        :
                        <span className="value">{editedItem.date}</span>
                    }
                </div>

                {editItem ?
                    <div className="add-footer">
                        <span>Сохранить?</span>
                        <div className="add-btns">
                            <IoClose onClick={() => setEditItem(false)} />
                            <FaCheck onClick={saveChanges}/>
                        </div>
                    </div>
                    
                    : deleteItem ?
                    <div className="add-footer">
                        <span>Удалить?</span>
                        <div className="add-btns">
                            <IoClose onClick={() => setDeleteItem(false)} />
                            <FaCheck  onClick={deleteSpend}/>
                        </div>
                    </div>
                        :
                    <div className="add-footer">
                        <button onClick={addNewEnliste}>Оплачено</button>
                        <div className="add-btns">
                            <FaRegTrashCan  onClick={() => setDeleteItem(true)}/>
                            <FaRegPenToSquare onClick={() => setEditItem(true)}/>
                        </div>
                    </div>
                }

            </div>

        </div>
    )
}