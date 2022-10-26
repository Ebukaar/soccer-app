import React from 'react';
import { useState, useEffect, useRef } from "react";
import { db } from "./firebase-config";
import { collection, addDoc, updateDoc, doc, orderBy, query, getDocs, deleteDoc } from "firebase/firestore";
import './Results.css'

const Results = () => {
    const resultsCollectionRef = collection(db, "results");
    const r = query(resultsCollectionRef, orderBy("serialNum", "asc"));

    const [results, setResults] = useState([])

        useEffect(() => {
            const getResults = async () => {
              const data = await getDocs(r, resultsCollectionRef)
              
              // console.log(data);
              setResults(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            };
            getResults();
          }, []);
     

    return (
      <div className="result-card">
        <h1 className='result-header'>Results</h1>
          <div className=''>
                {results.map((result, index) => {
                    return (
                        <div className='result' key={index}>
                            <section className='match-title'>
                            <p>{result.matchDated}</p>
                            <p className='serialNum-result'>{result.serialNum}</p>
                            <p>{result.duration}</p>
                            </section>
                            <section className='match-scores'>
                            <p>{result.firstTeamScore}</p>
                            <i class="fa-solid fa-minus"></i>
                            <p>{result.secondTeamScore}</p>
                            </section>
                            <section className='match-body'>
                            <p>{result.firstTeam}</p>
                            <p>{result.secondTeam}</p>
                            </section>
     
                    
                        </div> 
                    )})}   
           
        </div>
        </div>
    )

}
export default Results

/* 
return (
      <div className="card">
        <h1>Results</h1>
          <section className=''>
                {results.map((result, index) => {
                    return (
                        <div className='' key={index}>
                            <section className='match-title'>
                            <p>{result.matchDated}</p>
                            <p>{result.duration}</p>
                            </section>
                            <section className='match-body'>
                            <p>{result.firstTeam}</p>
                            <p>{result.firstTeamScore}</p>
                            <p>{result.secondTeamScore}</p>
                            <p>{result.secondTeam}</p>
                            </section><br /><br />
     
                    
                        </div> 
                    )})}   
            </div>
        </section>
    )

}

*/