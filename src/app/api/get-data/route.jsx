import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function  POST(request, res) {
    try {
        const req = await request.json();
        // const { searchParams } = new URL(request.url)
        // const collectionName = searchParams.get('dbName')
        const collectionName = req.params.dbName
        const client = await clientPromise;
        const db = client.db("WalletDB");
        const collection = await db.collection(collectionName)
        const data = await collection.find().toArray()
        return NextResponse.json(data)
        
    } catch (e) {
        console.error(e);
    }
};