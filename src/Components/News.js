import React from 'react';
import { useState, useEffect, useRef } from "react";
import { db } from "./firebase-config";
// import './Admin.css'
import { collection, addDoc, updateDoc, doc, orderBy, query, getDocs, deleteDoc } from "firebase/firestore";
import './News.css'
const News = () => {
    const newsCollectionRef = collection(db, "news" );

    const [news, setNews] = useState([])
    const n = query(newsCollectionRef, orderBy("serialNumo", "asc"));

    useEffect(()=> {
        const getNews = async () => {
            const data = await getDocs(n, newsCollectionRef)
            setNews(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };
        getNews();
    }, []);




    return (
        <section className='news-section-wrapper'>
            <h1 className='news-heading'>News</h1>

            <div className="">
             {news.map((news, index) => {
                return (
                    <div key={index} className='news'>
                        <section>
                            <p className='post-title'>{news.postTitle}</p>
                            <p className='news-date'>{news.postDate}</p>
                            <p className='news-serialNum'>{news.serialNumo}</p>
                            <p className='news-body'>{news.postBody}</p>
                        </section>

                    </div>
                )
             })}   
            </div>
        </section>
    )
}

export default News