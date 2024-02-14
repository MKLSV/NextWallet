import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const req = await request.json();
        const collectionName = req.params.dbName
        const newData = req.params.data
        const client = await clientPromise;
        const db = client.db("WalletDB");
        const collection = await db.collection(collectionName)
        const data = await collection.insertOne(newData)
        return NextResponse.json(data)

    } catch (e) {
        console.error('cannot insert data', err)
        throw err
    }
};