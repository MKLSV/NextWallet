import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import dbService from "../lib/db.service";

export function SelectedIncomeModal({ setLoader, selectedIncome, setSelectedIncome, setIncomes, incomes }) {

    const [deleteModal, setDeleteModal] = useState(false)
    const [editItem, setEditItem] = useState(false)
    const [editedItem, setEditedItem] = useState({ ...selectedIncome })

    const incomesToUpdate = [...incomes]

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

    async function saveChanges() {
        setEditItem(false)
        setLoader(true)
        await dbService.updateData(editedItem, 'Incomes')
        const updatedIncomes = incomesToUpdate.map(income =>
            income._id === editedItem._id ? { ...editedItem } : income
        );
        setIncomes(updatedIncomes)
        setLoader(false)
        setSelectedIncome(null)
    }

    async function deleteIncome() {
        setLoader(true)
        await dbService.removeData(selectedIncome._id, "Incomes")
        const updatedIncomes = incomesToUpdate.filter(income => income._id !== selectedIncome._id)
        setIncomes(updatedIncomes)
        setLoader(false)
        setSelectedIncome(null)
    }

    return (
        <div className="item-modal" onClick={() => setSelectedIncome(null)}>
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
                <div className="item">
                    <label>Число</label>
                    {editItem ?
                        <input type="text" id="date" value={editedItem.date} onChange={(e) => handleChange(e)} />
                        :
                        <span>{editedItem.date}</span>
                    }
                </div>
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