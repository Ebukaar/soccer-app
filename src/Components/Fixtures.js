import React from 'react';
import { useState, useEffect, useRef } from "react";
import { db } from "./firebase-config";
import { collection, addDoc, updateDoc, doc, orderBy, query, getDocs, deleteDoc } from "firebase/firestore";
import './Fixtures.css'
import { Link } from 'react-router-dom';


const Fixtures = () => {
   const fixturesCollectionRef = collection(db, "fixtures");



   const [fixtures, setFixtures ] = useState([])
   const f = query(fixturesCollectionRef, orderBy("serialNo", "asc"));


    useEffect(() => {
        const getFixtures = async () => {
            const data = await getDocs(f, fixturesCollectionRef)

            setFixtures(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
        };
        getFixtures();
    }, []);
    



    return (
      <div className="fixture-card" >
         <h1>Fixtures</h1>
        <div className=''>
            {fixtures.map((fixture, index) => { 
                return (
                  
                  <div  key={index} className='fixture'>
                    <Link to='/results'>
                    <p className='matchDate'>{fixture.matchDate}</p>
                    <p className='matchTime'>{fixture.matchTime}</p>
                    <p className='matchSerialNo'>{fixture.serialNo}</p>
                    <section className='fixtures-table'>
                    <p >{fixture.leftTeam}</p>
                    <p >{fixture.rightTeam}</p>
                    </section>
                    </Link>
                  </div> 
                  
                )
                })}  
            
        </div>
        </div> 
    )
}

export default Fixtures