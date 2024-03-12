import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6"
import { FaRegPenToSquare } from "react-icons/fa6"
import dbService from "../../lib/db.service";

export function SelectedIncomeModal({ setLoader, setSelectedIncome, selectedIncome, setIncomes, incomes }) {

    const [deleteItem, setDeleteItem] = useState(false)
    const [editItem, setEditItem] = useState(false)
    const [editedItem, setEditedItem] = useState({ ...selectedIncome })

    const incomesToUpdate = [...incomes]

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
        const updatedincomes = incomesToUpdate.map(income =>
            income._id === editedItem._id ? { ...editedItem } : income
        );
        setIncomes(updatedincomes)
        setLoader(false)
        setSelectedIncome(null)
    }
    async function deleteIncome() {
        setLoader(true)
        await dbService.removeData(selectedIncome._id, "Incomes")
        const updatedincomes = incomesToUpdate.filter(income => income._id !== selectedIncome._id)
        setIncomes(updatedincomes)
        setLoader(false)
        setSelectedIncome(null)
    }


    return (
        <div className="modal" onClick={() => setSelectedIncome(null)}>
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
                            <FaCheck onClick={saveChanges} />
                        </div>
                    </div>

                    : deleteItem ?
                        <div className="add-footer">
                            <span>Удалить?</span>
                            <div className="add-btns">
                                <IoClose onClick={() => setDeleteItem(false)} />
                                <FaCheck onClick={deleteIncome} />
                            </div>
                        </div>
                        :
                        <div className="add-footer">
                            <div className="add-btns">
                                <FaRegTrashCan onClick={() => setDeleteItem(true)} />
                                <FaRegPenToSquare onClick={() => setEditItem(true)} />
                            </div>
                        </div>
                }

            </div>

        </div>
    )
}