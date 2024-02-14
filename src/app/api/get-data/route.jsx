import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function  GET(request, res) {
    try {
        const { searchParams } = new URL(request.url)
        const collectionName = searchParams.get('dbName')
        const client = await clientPromise;
        const db = client.db("WalletDB");
        const collection = await db.collection(collectionName)
        const data = await collection.find().toArray()
        return NextResponse.json(data)
        
    } catch (e) {
        console.error(e);
    }
};