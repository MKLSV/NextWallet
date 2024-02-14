import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request) {
    try {
        const req = await request.json();
        const collectionName = req.params.dbName
        const id = req.params.id
        const client = await clientPromise;
        const db = client.db("WalletDB");
        const collection = await db.collection(collectionName)
        await collection.deleteOne({ _id: new ObjectId(id || req.params.id) })
        return NextResponse.json(id)
        
    } catch (e) {
        console.error('cannot insert data', err)
        throw err
    }
};