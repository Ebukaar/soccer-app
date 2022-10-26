import React, { useState, useEffect } from "react";
import "./Table.css";
import { db } from "./firebase-config";
// import 'bulma/css/bulma.min.css';
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";



const Table = () => {
  
  // We want to create a state that will hold the information about list of teams
  const [teams, setTeams] = useState([]);
  const teamsCollectionRef = collection(db, "teams");
  const q = query(teamsCollectionRef, orderBy("points", "desc"));


 

  //This function is going to be called whenever the page renders.
  useEffect(() => {
    const getTeams = async () => {
      const data = await getDocs(q, teamsCollectionRef)
      
      // console.log(data);
      setTeams(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getTeams();
  }, []);

  return (
    <div>
      <div>
        {/* <table className="table is-hoverable is-stripped"> */}
       
       
        <table className="content-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Club</th>
              <th>MP</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => {
              return (
                <tr key={team.teamName}>
                  {/* <td className="has-text-centered">{index + 1}</td> */}
                  <td>{index + 1}</td>
                  <td>{team.teamName}</td>
                  <td>{team.played}</td>
                  <td>{team.matchWon}</td>
                  <td>{team.matchDrawn}</td>
                  <td>{team.matchLost}</td>
                  <td>{team.goalDiff}</td>
                  <td>{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default Table;
