import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request) {
    try {
        const req = await request.json();
        const collectionName = req.params.dbName
        const newData = req.params.data
        console.log(newData)
        const updatedData = { ...newData }
        delete updatedData._id
        const client = await clientPromise;
        const db = client.db("WalletDB");
        const collection = await db.collection(collectionName)
        await collection.updateOne({ _id: new ObjectId(newData._id) }, { $set: updatedData })
        return NextResponse.json(newData)
        
    } catch (e) {
        console.error('cannot insert data', err)
        throw err
    }
};