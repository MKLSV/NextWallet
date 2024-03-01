import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import axios from "axios";
// 0 12 * * *
export async function GET() {
    const url = 'https://api.telegram.org/bot6587081386:AAEFpKmoTbj52EpWirs8WTN33I4VCqC6fdw/sendMessage?chat_id=555207329&text=';
    try {
        const collectionName = 'Spends'
        const client = await clientPromise;
        const db = client.db("WalletDB");
        const collection = await db.collection(collectionName)
        const data = await collection.find().toArray()
        const time = Date.now()
        const filteredData = data.filter(val => val.date !== 'done' && val.date !== 'Не горит' && Date.parse(val.date) - time < (7 * 24 * 60 * 60 * 1000))
        const message = filteredData.map(val => {
            const itemDate = Date.parse(val.date);
            const timeDifference = itemDate - time;
            let date;
            if (timeDifference > 0) {
                if (timeDifference < 24 * 60 * 60 * 1000) {
                    date = 'Сегодня';
                } else if (timeDifference < 2 * 24 * 60 * 60 * 1000) {
                    date = 'Завтра';
                } else {
                    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
                    date = `через ${days} ${days < 5 ? 'дня' : 'дней'}`;
                }
            }
            else {
                const days = Math.abs(Math.floor(timeDifference / (24 * 60 * 60 * 1000)));
                date = `нужно было оплатить ${days} ${days < 5 ? 'дня' : 'дней'} назад`;
            }

            return `${val.title} ${val.price} ${date || ''}`;
        });


        await axios.get(url + 'Гуд Морнинг')
        await axios.get(url + 'Вот что нужно оплатить на ближайшие 7 дней')
        for (let i = 0; i < message.length; i++) {
            await axios.get(url + message[i])

        }
        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error('cannot insert data', err)
        // throw err
    }
};