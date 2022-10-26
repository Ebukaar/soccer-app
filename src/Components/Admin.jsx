import React from 'react'
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { db } from "./firebase-config";
import { UserAuth} from './context/AuthContext'
import './Admin.css'
// import "./App.css";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject  } from "firebase/storage";
import { storage } from "./firebase-config";

import { collection, addDoc, updateDoc, doc, orderBy, query, getDocs, deleteDoc } from "firebase/firestore";


const Admin = () => {
  const teamsCollectionRef = collection(db, "teams");
  const navigate = useNavigate();

  const [editInput, setEditInput] = useState(false)
  const handleChange = () => {
    return setEditInput(!editInput)
  }

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const displayChange = () => {
    return setShowCreateTeam(!showCreateTeam)
  }

  const [teams, setTeams] = useState([]);
  const q = query(teamsCollectionRef, orderBy("points", "desc"));

  const {user, logout } = UserAuth();

  const [file, setFile] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const imagesListRef = ref(storage, '/files');


    // progress
    const [percent, setPercent] = useState(0);

    // To reset Input tag
    const inputRef = useRef(null);

  const [newTeamName, setNewTeamName] = useState("");
  const [newGoalDiff, setNewGoalDiff] = useState("");
  const [newPlayed, setNewPlayed] = useState(0);
  const [newPoints, setNewPoints] = useState(0);
  const [newMatchWon, setNewMatchWon] = useState(0);
  const [newMatchDrawn, setNewMatchDrawn] = useState(0);
  const [newMatchLost, setNewMatchLost] = useState(0);

  // for clubs 
  const clubsCollectionRef = collection(db, "clubs");
  const [newClubInfo, setNewClubInfo] = useState("");
  const [newClubName, setNewClubName] = useState("");

  const [clubs, setClubs] = useState([]);

    const [showCreateClub, setShowCreateClub] = useState(false)
    const displayClub = () => {
      return setShowCreateClub(!showCreateClub)
    }

     // State to store uploaded files
     const [logo, setLogo] = useState('')
     const [imageLinks, setImageLinks] = useState([])
 
     const logoListRef = ref(storage, '/logos');
 
     // To reset the Input tag
     const inputTagRef = useRef(null)
 
     // To show Progress
     const [percentage, setPercentage] = useState(0);
    

    //  functions starts

        // For adding logos
    // Handle file upload event and update state
    function handleReplace(event) {
      setLogo(event.target.files[0]);
  }

  const handleTransmit = () => {
      if (!logo) {
          alert('Please upload an image first');
      }

  const logoStorageRef = ref(storage, `/logos/${logo.name}`);


   // progress can be paused and resumed. It also exposes progress updates.
   // Receives the storage reference and the file to upload.
   const uploadMission = uploadBytesResumable(logoStorageRef, logo);

   uploadMission.on(
      'state_changed',
      (snapshot) => {
          const percentage = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercentage(percentage);
      },
      (err) => console.log(err),
      () => {
          //download url
          getDownloadURL(uploadMission.snapshot.ref).then((url) => {
              setImageLinks((prev) => [...prev, url]);
              resetLogoFileInput()
          });
      }
   )
  }
  // To clear the input tag after upload
  const resetLogoFileInput = () => {
      // This will reset the input tag
      inputTagRef.current.value = null;
  }

  const createClubAndInfo = async () => {
    await addDoc(clubsCollectionRef, {
      clubInfo : newClubInfo,
      clubName: newClubName,
    })
    .then(()=>{
      // alert('Entry succesful');
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
  };

  const [changeInput, setChangeInput] = useState(false)
    const handleEdit = () => {
    return setChangeInput(!changeInput)
    }

  // Update ClubName
const updateClubName = async (id, clubName) => {
const clubDoc = doc(db, 'clubs', id)
const newEntry = { clubName: newClubName }
await updateDoc(clubDoc, newEntry)
.then (()=>{
  // forceUpdate()
  window.location.reload(false);
})
.catch((error)=>{
  alert('Unsuccessful operation, error:'+error);
});
}

//   Update Club Info
const updateClubInfo = async (id, clubInfo ) => {
const clubDoc = doc(db, 'clubs', id)
const newEntry = {clubInfo: newClubInfo}
await updateDoc(clubDoc, newEntry)
.then (()=>{
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

const deleteClub = async (id) => {
    const clubDoc = doc(db, 'clubs', id)
    await deleteDoc(clubDoc)
    .then(()=>{
      // alert('Point reduced');
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
  
  }

//   To delete Logo
const deleteLogos = (url) => {
    let logoRef = ref(storage, (url));
    deleteObject(logoRef)
    .then(() => {
        setImageLinks(imageLinks.filter((image) => image !==url));
        alert('Picture is deleted succesfully!');
        window.location.reload(false);
    })
    .catch((err) => {
        console.log(err);
        alert('Unsuccesful operation, error:' +err); 
    })
}


  // functions ends for clubs

  // Club useEffect starts

  useEffect(()=> {
    listAll(logoListRef).then((response) => {
        response.items.forEach((item) => {
            getDownloadURL(item).then((url) => {
                setImageLinks((prev) => [...prev, url]);
                console.log(url)
            });
        });
    });
}, []);

useEffect(() => {
  const getClubs = async () => {
    const data = await getDocs(clubsCollectionRef)
    
    // console.log(data);
    setClubs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  getClubs();
}, []);

// UseEffect for club ends here


// for Fixtures
const fixturesCollectionRef = collection(db, "fixtures");
const f = query(fixturesCollectionRef, orderBy("serialNo", "asc"));

const [newMatchDate, setNewMatchDate] = useState("");
const [newLeftTeam, setNewLeftTeam] = useState("");
const [newMatchTime, setNewMatchTime] = useState("");
const [newRightTeam, setNewRightTeam] = useState("");
const [newSerialNo, setNewSerialNo] = useState(0);

const [showCreateFixture, setShowCreateFixture] = useState(false)
const displayFixtureCreate = () => {
    return setShowCreateFixture(!showCreateFixture)
}


const [fixtures, setFixtures ] = useState([])

// To create fixture
const createFixture = async () => {
  await addDoc (fixturesCollectionRef, {
      matchDate: newMatchDate,
      leftTeam: newLeftTeam,
      matchTime: newMatchTime,
      rightTeam: newRightTeam,
      serialNo: Number(newSerialNo),
  })
  .then(()=>{
      // alert('Entry succesful');
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
}

const [changeFixtureInput, setChangeFixtureInput] = useState(false)
    const handleModify = () => {
        return setChangeFixtureInput(!changeFixtureInput)
    }

    // To delete Fixtures
    const deleteFixture = async (id) => {
        const fixtureDoc = doc(db, 'fixtures', id)
        await deleteDoc(fixtureDoc)
        .then(()=>{
            // alert('Point reduced');
            // forceUpdate()
            window.location.reload(false);
          })
          .catch((error)=>{
            alert('Unsuccessful operation, error:'+error);
          });
    }

    // To update MatchDate
    const updateMatchDate = async(id, matchDate) => {
      const matchDateDoc = doc(db, 'fixtures', id)
      const newEntry = {matchDate: newMatchDate}
      await updateDoc(matchDateDoc, newEntry)
      .then (()=>{
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
    }

    // To update LeftTeam
    const updateLeftTeam = async (id, leftTeam) => {
        const leftTeamDoc = doc(db, 'fixtures', id)
        const newEntry = {leftTeam: newLeftTeam}
        await updateDoc(leftTeamDoc, newEntry)
        .then (()=>{
            // forceUpdate()
            window.location.reload(false);
          })
          .catch((error)=>{
            alert('Unsuccessful operation, error:'+error);
          });
    }

    // To update matchTime
    const updateMatchTime = async (id, matchTime ) => {
        const matchTimeDoc = doc(db, 'fixtures', id)
        const newEntry = {matchTime: newMatchTime}
        await updateDoc(matchTimeDoc, newEntry)
        .then (()=>{
            // forceUpdate()
            window.location.reload(false);
          })
          .catch((error)=>{
            alert('Unsuccessful operation, error:'+error);
          });
    }

    // To update Serial Number
    const updateSerialNo = async (id, serialNo) => {
      const serialNoDoc = doc(db, 'fixtures', id)
      const newEntry = {serialNo: newSerialNo}
      await updateDoc(serialNoDoc, newEntry)
      .then (()=>{
          // forceUpdate()
          window.location.reload(false);
        })
        .catch((error)=>{
          alert('Unsuccessful operation, error:'+error);
        });
  }


    // To update right team
    const updateRightTeam = async (id, rightTeam) => {
        const rightTeamDoc = doc(db, 'fixtures', id)
        const newEntry = {rightTeam: newRightTeam}
        await updateDoc(rightTeamDoc, newEntry)
        .then (()=>{
            // forceUpdate()
            window.location.reload(false);
          })
          .catch((error)=>{
            alert('Unsuccessful operation, error:'+error);
          });
    }

    useEffect(() => {
      const getFixtures = async () => {
          const data = await getDocs(f, fixturesCollectionRef)

          setFixtures(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
      };
      getFixtures();
  }, []);

// fixtures ends

// Results
const resultsCollectionRef = collection(db, "results");
const r = query(resultsCollectionRef, orderBy("serialNum", "asc"));


const [newDuration, setNewDuration] = useState("");
const [newFirstTeam, setNewFirstTeam] = useState("");
const [newFirstTeamScore, setNewFirstTeamScore] = useState(0);
const [newMatchDated, setNewMatchDated ] = useState("");
const [newSecondTeam, setNewSecondTeam ] = useState("");
const [newSecondTeamScore, setNewSecondTeamScore ] = useState(0);
const [newSerialNum, setNewSerialNum] = useState(0);

const [results, setResults] = useState([])


const [showCreateResult, setShowCreateResult] = useState(false)
const displayCreate = () => {
  return setShowCreateResult(!showCreateResult)
}

const createResult = async () => {
  await addDoc( resultsCollectionRef, {
      duration: newDuration,
      firstTeam: newFirstTeam,
      firstTeamScore: Number(newFirstTeamScore),
      matchDated: newMatchDated,
      secondTeam: newSecondTeam,
      secondTeamScore: Number(newSecondTeamScore),
      serialNum: Number(newSerialNum),

  })
  .then(()=>{
      // alert('Entry succesful');
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
  };

  const [changeResultInput, setChangeResultInput] = useState(false)
  const handleRevise = () => {
  return setChangeResultInput(!changeResultInput)
  }

  // To delete Results
  const deleteResult = async (id) => {
      const resultDoc = doc(db, 'results', id)
      await deleteDoc(resultDoc)
      .then(()=>{
        // alert('Point reduced');
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
    
    }
  

  // To update matchDate
  const updateMatchDated = async (id, matchDate) => {
      const matchDoc = doc(db, 'results', id)
      const newEntry = { matchDated: newMatchDated }
      await updateDoc(matchDoc, newEntry)
      .then (()=>{
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
      }

  // To update duration
  const updateDuration = async (id, duration) => {
      const durationDoc = doc(db, 'results', id)
      const newEntry = {duration: newDuration}
      await updateDoc(durationDoc, newEntry)
      .then (()=>{
          // forceUpdate()
          window.location.reload(false);
        })
        .catch((error)=>{
          alert('Unsuccessful operation, error:'+error);
        });
  }

  // To update first team
  const updateFirstTeam = async (id, firstTeam) => {
      const firstTeamDoc = doc(db, 'results', id)
      const newEntry = { firstTeam: newFirstTeam}
      await updateDoc(firstTeamDoc, newEntry)
      .then (()=>{
          // forceUpdate()
          window.location.reload(false);
        })
        .catch((error)=>{
          alert('Unsuccessful operation, error:'+error);
        });
  }

  // To update first team score 
  const updateFirstTeamScore = async (id, firstTeamScore) => {
      const firstTeamScoreDoc = doc(db, 'results', id)
      const newEntry = { firstTeamScore: newFirstTeamScore}
      await updateDoc(firstTeamScoreDoc, newEntry)
      .then (()=>{
          // forceUpdate()
          window.location.reload(false);
        })
        .catch((error)=>{
          alert('Unsuccessful operation, error:'+error);
        });
  }

  // To update second team score
  const updateSecondTeamScore = async (id, secondTeamScore) => {
      const secondTeamScoreDoc = doc(db, 'results', id)
      const newEntry = { secondTeamScore: newSecondTeamScore}
      await updateDoc( secondTeamScoreDoc, newEntry )
      .then (()=>{
          // forceUpdate()
          window.location.reload(false);
        })
        .catch((error)=>{
          alert('Unsuccessful operation, error:'+error);
        });
  }

  // to update Serial Num
  const updateSerialNum = async (id, serialNum) => {
    const serialNumDoc = doc(db, 'results', id)
    const newEntry = { serialNum: newSerialNum }
    await updateDoc(serialNumDoc, newEntry)
    .then (()=>{
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
    }

  // To update second team
  const updateSecondTeam = async (id, secondTeam) => {
      const secondTeamDoc = doc(db, 'results', id)
      const newEntry = { secondTeam: newSecondTeam}
      await updateDoc(secondTeamDoc, newEntry)
      .then (()=>{
          // forceUpdate()
          window.location.reload(false);
        })
        .catch((error)=>{
          alert('Unsuccessful operation, error:'+error);
        });
  }



  useEffect(() => {
      const getResults = async () => {
      const data = await getDocs(r, resultsCollectionRef)
      
      // console.log(data);
      setResults(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getResults();
  }, [])

// Result ends



// News Page Begins
const newsCollectionRef = collection(db, "news" );

const [newPostTitle, setNewPostTitle] = useState("");
const [newPostDate, setNewPostDate] = useState("");
const [newPostBody, setNewPostBody] = useState("");
const [newSerialNumber, setNewSerialNumber] = useState(0);

const [news, setNews] = useState([])
const n = query(newsCollectionRef, orderBy("serialNumo", "asc"));

const [showCreateNews, setShowCreateNews] = useState(false)
const displayNewsCreate = () => {
    return setShowCreateNews(!showCreateNews)
}

const createNews = async () => {
    await addDoc (newsCollectionRef, {
        postTitle: newPostTitle,
        postDate: newPostDate,
        postBody: newPostBody,
        serialNumo: Number(newSerialNumber),
    })
    .then(()=>{
        // alert('Entry succesful');
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
}

const [changeNewsInput, setChangeNewsInput] = useState(false)
const handleRedraft = () => {
    return setChangeNewsInput(!changeNewsInput)
}

// To delete News
const deleteNews = async (id) => {
    const newsDoc = doc(db, 'news', id)
    await deleteDoc(newsDoc)
    .then(()=>{
        // alert('Point reduced');
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
}

// To update postTitle
const updatePostTitle = async (id, postTitle) => {
    const postTitleDoc = doc(db, 'news', id)
    const newEntry = {postTitle: newPostTitle}
    await updateDoc(postTitleDoc, newEntry)
    .then (()=>{
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
}

// to update postDate
const updatePostDate = async (id, postDate) => {
    const postDateDoc = doc(db, 'news', id)
    const newEntry = {postDate: newPostDate}
    await updateDoc(postDateDoc, newEntry)
    .then (()=>{
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
}

// to update SerialNumo
const updateSerialNumo = async (id, serialNumo) => {
  const serialNumoDoc = doc(db, 'news', id)
  const newEntry = {serialNumo: newSerialNumber}
  await updateDoc(serialNumoDoc, newEntry)
  .then (()=>{
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
}

// to update postBody
const updatePostBody = async (id, postBody) => {
    const postBodyDoc = doc(db, 'news', id)
    const newEntry = {postBody: newPostBody}
    await updateDoc(postBodyDoc, newEntry)
    .then (()=>{
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
}

useEffect(()=> {
    const getNews = async () => {
        const data = await getDocs(n, newsCollectionRef)
        setNews(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };
    getNews();
}, []);


// News Page ends



   // Add doc helps us to create a new user gotten from firebase
   const createTeam = async () => {
    await addDoc(teamsCollectionRef, {
      goalDiff: newGoalDiff,
      played: Number(newPlayed),
      points: Number(newPoints),
      matchWon: Number(newMatchWon),
      matchLost: Number(newMatchLost),
      matchDrawn: Number(newMatchDrawn),
      teamName: newTeamName,
    })
    .then(()=>{
      // alert('Entry succesful');
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
  };

  useEffect(() => {
    const getTeams = async () => {
      const data = await getDocs(q, teamsCollectionRef);
      // console.log(data);
      setTeams(data.docs.map((doc) => 
      ({ ...doc.data(),
         id: doc.id })));
    };
    getTeams();
  }, []);

  // To update Matches Won
  const updateMatchWon = async (id, matchWon) => {
    const teamDoc = doc(db, 'teams', id)
    const newEntry = {matchWon: matchWon + 1}
    await updateDoc(teamDoc, newEntry)
    .then(()=>{
      // alert('Point updated');
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
}

// To reduce match Won
const reduceMatchWon = async (id, matchWon) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {matchWon: matchWon - 1}
  await updateDoc(teamDoc, newEntry)
  .then(()=>{
    // alert('Point updated');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// To update Match Lost
const updateMatchLost = async (id, matchLost) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {matchLost: matchLost + 1}
  await updateDoc(teamDoc, newEntry)
  .then(()=>{
    // alert('Point updated');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// To reduce Match Lost
const reduceMatchLost = async (id, matchLost) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {matchLost: matchLost - 1}
  await updateDoc(teamDoc, newEntry)
  .then(()=>{
    // alert('Point updated');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// To update Match Drawn
const updateMatchDrawn = async (id, matchDrawn) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {matchDrawn: matchDrawn + 1}
  await updateDoc(teamDoc, newEntry)
  .then(()=>{
    // alert('Point updated');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// To reduce Match Drawn
const reduceMatchDrawn = async (id, matchDrawn) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {matchDrawn: matchDrawn - 1}
  await updateDoc(teamDoc, newEntry)
  .then(()=>{
    // alert('Point updated');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}


  //To update the points in the table
  const updatePoint = async (id, points) => {
      const teamDoc = doc(db, 'teams', id)
      const newEntry = {points: points + 3}
      await updateDoc(teamDoc, newEntry)
      .then(()=>{
        // alert('Point updated');
        // forceUpdate()
        window.location.reload(false);
      })
      .catch((error)=>{
        alert('Unsuccessful operation, error:'+error);
      });
  }
  // To reduce points
  const reducePoint = async (id, points) => {
    const teamDoc = doc(db, 'teams', id)
    const newEntry = {points: points - 3}
    await updateDoc(teamDoc, newEntry)
    .then(()=>{
      // alert('Point reduced');
      // forceUpdate()
      window.location.reload(false);
    })
    .catch((error)=>{
      alert('Unsuccessful operation, error:'+error);
    });
}

const deleteTeam = async (id) => {
  const teamDoc = doc(db, 'teams', id)
  await deleteDoc(teamDoc)
  .then(()=>{
    // alert('Point reduced');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });

}


// To delete images 
const deleteImages = (url) => {
  // let pictureRef = storage.refFromURL(url);
  let pictureRef = ref(storage, (url));
  // pictureRef
  // .delete()
  deleteObject(pictureRef)
  .then(()=> {
    setImageUrls(imageUrls.filter((image) => image !==url));
      alert('Picture is deleted succesfully!');
      window.location.reload(false);
  })
  .catch((err) => {
    console.log(err);
    alert('Unsuccessful operation, error:'+err);
  });
}



// To update goal difference
const updateGoalDiff = async (id, goalDiff) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {goalDiff: goalDiff + 1}
  await updateDoc(teamDoc, newEntry)
  .then(()=>{
    // alert('Goal Difference updated');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// To reduce goal Difference
const reduceGoalDiff = async (id, goalDiff) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {goalDiff: goalDiff - 1 }
  await updateDoc(teamDoc, newEntry)
  .then(()=>{
    // alert('Goal Difference reduced');
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// To update played
const updatePlayed = async (id, played) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {played: played + 1 }
  await updateDoc(teamDoc, newEntry)
  .then (()=>{
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// To reduce played
const reducePlayed = async (id, played) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = {played: played - 1 }
  await updateDoc(teamDoc, newEntry)
  .then (()=>{
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}

// Update TeamName
const updateTeamName = async (id, teamName) => {
  const teamDoc = doc(db, 'teams', id)
  const newEntry = { teamName: newTeamName }
  await updateDoc(teamDoc, newEntry)
  .then (()=>{
    // forceUpdate()
    window.location.reload(false);
  })
  .catch((error)=>{
    alert('Unsuccessful operation, error:'+error);
  });
}


  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message)
    }
  }
  
  // For adding images
   // Handle file upload event and update state
   function handleChanging(event) {
    setFile(event.target.files[0]);
}

const handleUpload = () => {
    if (!file) {
        alert("Please upload an image first!");
    }

    const storageRef = ref(storage, `/files/${file.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            setPercent(percent);
            
          
        },
        (err) => console.log(err),
        () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
             setImageUrls((prev) => [...prev, url]);
             resetFileInput()
            
                
            });
        }
    );
};

// To clear the input tag after upload
const resetFileInput = () => {
  // This will reset the input value
  inputRef.current.value = null;
}

useEffect(() => {
  listAll(imagesListRef).then((response) => {
    response.items.forEach((item) => {
     getDownloadURL(item).then((url) => {
         setImageUrls((prev) => [...prev, url]);
       console.log(url)
     });
   });
 });
}, []);



  return (

    // className='max-w-[600px] mx-auto my-16 p-4'
  // className='text-2xl font-bold py-4'
    <div className='admin-styling'>
      <div className = 'admin-header'>
      <h1 className="is-big">Admin</h1> 
      <button  className='btn' onClick={handleLogout} >Logout </button>
      </div>
      
      <p className='is-padded-left'>Welcome back: {user && user.email}</p>

     
      <div className='create-box' >
      <h1 className='table-title'>Table Section</h1>
      {/* Create a new team entry */}
      <button className='btn' onClick={()=> displayChange()}>Create Team</button><br />
      {showCreateTeam && <>
      <button className='btn-round' onClick={()=> displayChange()}><i class="fa-solid fa-xmark"></i></button>
      <label className='label-field lined'>
      <input type='string'  onChange={(event) => { setNewTeamName(event.target.value); }} required/>
      <span className='placeholder'>Enter Team Name</span>
      </label>
      
      <label className='label-field lined'>
      <input type="number"  onChange={(event) => { setNewPlayed(event.target.value); }} required/>
      <span className='placeholder'>Enter Matches played</span>
      </label>
      
      <label className='label-field lined'>
      <input type="number" onChange={(event) => { setNewPoints(event.target.value); }} required/>
      <span className='placeholder'>Enter Points</span>
      </label>

      <label className='label-field lined'>
      <input type="number" onChange={(event) => { setNewMatchWon(event.target.value); }} required/>
      <span className='placeholder'>Enter Matches Won</span>
      </label>

      <label className='label-field lined'>
      <input type="number" onChange={(event) => { setNewMatchLost(event.target.value); }} required/>
      <span className='placeholder'>Enter Matches Lost</span>
      </label>

      <label className='label-field lined'>
      <input type="number" onChange={(event) => { setNewMatchDrawn(event.target.value); }} required/>
      <span className='placeholder'>Enter Matches Drawn</span>
      </label>
      
      <label className='label-field lined'>
      <input type="string"  onChange={(event) => { setNewGoalDiff(event.target.value); }} required/>
      <span className='placeholder'>Enter Goal Difference</span>
      </label>

      <button className='btn' onClick={createTeam}>Create a new team</button>
      </> }
      </div>

<div>
      <div>
        <table className="content-table-admin">
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
              <th><i className="fa-solid fa-trash-can"></i></th>
              <th>Pts</th>
              <th>GD</th>
              <th>MP</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>Club</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => {
              return (
                <tr key={team.teamName}>
                  <td>{index + 1}</td>
                  <td>{team.teamName} </td>
                  <td>{team.played}</td>
                  <td>{team.matchWon}</td>
                  <td>{team.matchDrawn}</td>
                  <td>{team.matchLost}</td>
                  <td>{team.goalDiff}</td>
                  <td>{team.points} </td>
                  <td>
                    <button className='is-sized'  onClick ={()=> {deleteTeam(team.id )}}><i className="fa-regular fa-trash-can"></i></button>
                  </td>
                  <td className='space'>
                    <button className='is-sized' onClick ={()=> {updatePoint(team.id, team.points )}}><i className="fa-solid fa-plus"></i></button>
                    <button className='is-sized' onClick ={()=> {reducePoint(team.id, team.points )}}><i className="fa-solid fa-minus"></i></button>
                  </td>
                  <td className='space'>
                    <button className='is-sized' onClick ={()=> {updateGoalDiff(team.id, team.goalDiff )}}><i className="fa-solid fa-plus"></i></button>
                    <button className='is-sized' onClick ={()=> {reduceGoalDiff(team.id, team.goalDiff )}}><i className="fa-solid fa-minus"></i></button>
                  </td>
                  <td className='space'>
                    <button className='is-sized' onClick ={()=> {updatePlayed(team.id, team.played )}}><i className="fa-solid fa-plus"></i></button>
                    <button className='is-sized' onClick ={()=> {reducePlayed(team.id, team.played )}}><i className="fa-solid fa-minus"></i></button>
                  </td>
                  <td className='space'>
                    <button className='is-sized' onClick ={()=> {updateMatchWon(team.id, team.matchWon )}}><i className="fa-solid fa-plus"></i></button>
                    <button className='is-sized' onClick ={()=> {reduceMatchWon(team.id, team.matchWon )}}><i className="fa-solid fa-minus"></i></button>
                  </td>
                  <td className='space'>
                    <button className='is-sized' onClick ={()=> {updateMatchDrawn(team.id, team.matchDrawn )}}><i className="fa-solid fa-plus"></i></button>
                    <button className='is-sized' onClick ={()=> {reduceMatchDrawn(team.id, team.matchDrawn )}}><i className="fa-solid fa-minus"></i></button>
                  </td>
                  <td className='space'>
                    <button className='is-sized' onClick ={()=> {updateMatchLost(team.id, team.matchLost )}}><i className="fa-solid fa-plus"></i></button>
                    <button className='is-sized' onClick ={()=> {reduceMatchLost(team.id, team.matchLost )}}><i className="fa-solid fa-minus"></i></button>
                  </td>
                  <td>
                    
                  <button className='btn' onClick={()=> handleChange()}>Edit</button>
                  <div className='is-spaced'>
                 {editInput && <>
                  <label className='label-field lined'>
                 <input type='string' onChange={(event) => { setNewTeamName(event.target.value); } } required/>
                 <span className='placeholder'>Enter New Team Name</span>
                  </label>
                 <button className='btn' onClick={() => { updateTeamName(team.id, team.teamName); } }>Update</button>
                 </> }
                 </div>
                  </td>
                  
                  
                  
                  
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

            {/* Gallery Section begins here */}
            <h1 className='table-title'> Gallery Section</h1>
            <div className='upload-section'>
            <input ref={ inputRef } type="file" className="input-tag" onChange={handleChanging} accept="/image/*" />
           <button className='btn regular' onClick={handleUpload}>Upload</button>
            <p >{percent} % done</p>
            </div>

                <div className="">
                {imageUrls.map((image, index) => { 
                    return (
                     <>
                     <img className='gallery-image-admin' src={image} alt='' key={index + 1} />
                     <button className='is-sized shift' onClick={ ()=> deleteImages(image) }><i className="fa-regular fa-trash-can"></i></button>
                     </>
                    )
                })}
                </div>
            

            {/*  The clubs page*/}
            <section>
            
            <div className='center'>
            <h1 className='table-title'>Club Section</h1>
            <button className='btn' onClick={()=> displayClub()}>Create Club</button><br />
            {showCreateClub && 
            <>
            <button className='btn-round' onClick={()=> displayClub()}><i class="fa-solid fa-xmark"></i></button>
            <label className='label-field lined'>
            <input type='string' onChange={(event) => { setNewClubName(event.target.value); } } required/>
            <span className='placeholder'>Enter New Club Name</span>
            </label>

            <label for="fname" className='txt'>Club Info:</label>
            <textarea id="txtid" name="txtname" rows="6" cols="50" maxlength="200" onChange={(event) => { setNewClubInfo(event.target.value); }} required>
            </textarea><br />
            <button className='btn' onClick={createClubAndInfo}>Create a new club</button>
            </> }
            </div>


            <div className="club-card">
              {clubs.map((club, index) => {
                  return (
                      <div className='' key={index}>
                          <h1>{club.clubName}</h1>
                          <p>{club.clubInfo}</p>
                      <button className='is-sized' onClick ={()=> {deleteClub(club.id )}}><i className="fa-regular fa-trash-can"></i></button>&nbsp;&nbsp;
                      <button className='btn' onClick={()=> handleEdit()}>Edit</button>
                    
                      <section className='create-box'>
                      {changeInput && <>
                        <label className='label-field lined'>
                      <input type='string' onChange={(event) => { setNewClubName(event.target.value); } } required/>
                      <span className='placeholder'>Enter New Club Name</span>
                        </label>
                        <label className='label-field lined'>
                      <input type='string' onChange={(event) => { setNewClubInfo(event.target.value); } } required/>
                      <span className='placeholder'>Enter New Club Info</span>
                        </label>
                      <button className='btn' onClick={() => { updateClubName(club.id, club.clubName); updateClubInfo(club.id, club.clubInfo) }} >Update</button>
                      </> }
                      </section>
                      </div>                     
                  )})}
            </div>
            
            <div>
             <div className='upload-section-one'>
                <input ref={ inputTagRef } type="file" className="input-tag" onChange={handleReplace} accept='/image/*' />
                <button className='btn regular' onClick={handleTransmit}>Upload</button>
                <p>{percentage} % done</p>
              </div>
            </div>        
            

            <div className="">
              {imageLinks.map((image, index) =>{
                  return (
                      <>
                      <img className='club-image-admin' src={image} alt='' key={index} />
                      <button className='is-sized' onClick={()=> deleteLogos(image)}><i className="fa-regular fa-trash-can"></i></button>
                      </>
                  )
              })}
            </div>
            </section>
            {/* The clubs page ends */}


            {/* Fixtures page begins */}
            <section className=''>
            

            <div className='create-box' >
            <h1 className='table-title'>Fixtures Section</h1>
            <button className='btn' onClick={()=> displayFixtureCreate()}>Create Fixtures</button><br />  
            {showCreateFixture && <>
            <button className='btn-round' onClick={()=> displayFixtureCreate()}><i class="fa-solid fa-xmark"></i></button>  
            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewMatchDate(event.target.value); }} required/>
            <span className='placeholder'>Enter Match Date</span>
            </label>
            
            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewLeftTeam(event.target.value); }} required/>
            <span className='placeholder'>Enter Team A</span>
            </label>

            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewMatchTime(event.target.value); }} required/>
            <span className='placeholder'>Enter Match Time</span>
            </label>

            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewRightTeam(event.target.value); }} required/>
            <span className='placeholder'>Enter Team B</span>
            </label>


            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewSerialNo(event.target.value); }} required/>
            <span className='placeholder'>Enter Serial Number e.g 1</span>
            </label>

            <button className='btn' onClick={createFixture}>Create a new fixture</button>
            
            </>} 
            </div>

            <div className="fixture-card" >
            {fixtures.map((fixture, index) => { 
                return (
                  <div  key={index} className='fixture'>
                    <Link to='/results'>
                    <p className='matchDate'>{fixture.matchDate}</p>
                    <p className='matchDate'>{fixture.serialNo}</p>
                    <p className='matchTime'>{fixture.matchTime}</p>
                    <section className='fixtures-table'>
                    <p >{fixture.leftTeam}</p>
                    <p >{fixture.rightTeam}</p>
                    </section>
                    </Link>
                    
                    
                    <button className='is-sized' onClick ={()=> {deleteFixture(fixture.id )}}><i className="fa-regular fa-trash-can"></i></button>&nbsp;&nbsp;
                    <button className='btn' onClick={()=> handleModify()}>Edit</button>
                    <section className='create-box'>
                        {changeFixtureInput && <>

                            <label className='label-field lined'>
                            <input type='string'  onChange={(event) => { setNewMatchDate(event.target.value); }} required/>
                            <span className='placeholder'>Enter Match Date</span>
                            </label>

                            <label className='label-field lined'>
                            <input type='string'  onChange={(event) => { setNewLeftTeam(event.target.value); }} required/>
                            <span className='placeholder'>Enter Team A</span>
                            </label>

                            <label className='label-field lined'>
                            <input type='string'  onChange={(event) => { setNewMatchTime(event.target.value); }} required/>
                            <span className='placeholder'>Enter Match Time</span>
                            </label>

                            <label className='label-field lined'>
                            <input type='string'  onChange={(event) => { setNewRightTeam(event.target.value); }} required/>
                            <span className='placeholder'>Enter Team B</span>
                            </label>

                            <label className='label-field lined'>
                            <input type='string'  onChange={(event) => { setNewSerialNo(event.target.value); }} required/>
                            <span className='placeholder'>Enter Serial Number e.g 1</span>
                            </label>

                            <button className='btn' onClick={ ()=>{ updateMatchDate(fixture.id, fixture.matchDate); updateLeftTeam(fixture.id, fixture.leftTeam); updateMatchTime(fixture.id, fixture.matchTime); updateRightTeam(fixture.id, fixture.rightTeam); updateSerialNo(fixture.id, fixture.serialNo) }}> Update </button>
                        
                        </>}
                    </section>
                  </div>  
                )})}  
            </div>
        </section>
      {/* fixture page ends */}

      {/* Result page begins */}
      <section className=''>
        

            <div className='create-box' >
            <h1 className='table-title'>Results Section</h1>
            <button className='btn' onClick={()=> displayCreate()}>Create Result</button><br />
            {showCreateResult && <>
            <button className='btn-round' onClick={()=> displayCreate()}><i class="fa-solid fa-xmark"></i></button>
            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewMatchDated(event.target.value); }} required/>
            <span className='placeholder'>Enter Match Date</span>
            </label>

            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewDuration(event.target.value); }} required/>
            <span className='placeholder'>Enter Duration</span>
            </label>

            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewFirstTeam(event.target.value); }} required/>
            <span className='placeholder'>Enter Team A</span>
            </label>

            <label className='label-field lined'>
            <input type='number'  onChange={(event) => { setNewFirstTeamScore(event.target.value); }} required/>
            <span className='placeholder'>Enter Team A Score</span>
            </label>

            <label className='label-field lined'>
            <input type='number'  onChange={(event) => { setNewSecondTeamScore(event.target.value); }} required/>
            <span className='placeholder'>Enter Team B Score</span>
            </label>

            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewSecondTeam(event.target.value); }} required/>
            <span className='placeholder'>Enter Team B </span>
            </label>

            <label className='label-field lined'>
            <input type='number'  onChange={(event) => { setNewSerialNum(event.target.value); }} required/>
            <span className='placeholder'>Enter Serial Number e.g 1</span>
            </label>

            <button className='btn' onClick={createResult}>Create a new team</button>
            </> }

            </div>

            <div className="result-card">
                {results.map((result, index) => {
                    return (
                        <div className='result' key={index}>
                            <section className='match-title'>
                            <p>{result.matchDated}</p>
                            <p>{result.serialNum}</p>
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
                            <button className='is-sized' onClick ={()=> {deleteResult(result.id )}}><i className="fa-regular fa-trash-can"></i></button>&nbsp;&nbsp;
                            <button className='btn' onClick={()=> handleRevise()}>Edit</button>

                            <section className='create-box' >
                                { changeResultInput && <>
                                    
                                    <label className='label-field lined'>
                                        <input type='string'  onChange={(event) => { setNewMatchDated(event.target.value); }} required/>
                                        <span className='placeholder'>Enter Match Date</span>
                                    </label>

                                    <label className='label-field lined'>
                                        <input type='string'  onChange={(event) => { setNewDuration(event.target.value); }} required/>
                                        <span className='placeholder'>Enter Duration</span>
                                    </label>

                                    <label className='label-field lined'>
                                        <input type='string'  onChange={(event) => { setNewFirstTeam(event.target.value); }} required/>
                                        <span className='placeholder'>Enter Team A</span>
                                    </label>

                                    <label className='label-field lined'>
                                        <input type='number'  onChange={(event) => { setNewFirstTeamScore(event.target.value); }} required/>
                                        <span className='placeholder'>Enter Team A Score</span>
                                    </label>

                                    <label className='label-field lined'>
                                        <input type='number'  onChange={(event) => { setNewSecondTeamScore(event.target.value); }} required/>
                                        <span className='placeholder'>Enter Team B Score</span>
                                    </label>

                                    <label className='label-field lined'>
                                        <input type='string'  onChange={(event) => { setNewSecondTeam(event.target.value); }} required/>
                                        <span className='placeholder'>Enter Team B </span>
                                    </label>

                                    <label className='label-field lined'>
                                    <input type='number'  onChange={(event) => { setNewSerialNum(event.target.value); }} required/>
                                    <span className='placeholder'>Enter Serial Number e.g 1</span>
                                    </label>

                                    <button className='btn' onClick={() => { updateMatchDated(result.id, result.matchDate); updateDuration(result.id, result.duration); updateFirstTeam(result.id, result.firstTeam); updateFirstTeamScore(result.id, result.firstTeamScore ); updateSecondTeamScore(result.id, result.secondTeamScore); updateSecondTeam(result.id, result.secondTeam); updateSerialNum(result.id, result.serialNum) }} >Update</button>
                                </>
                                }
                            </section>
                        </div> 
                    )})}   
            </div>
        </section>


        {/* News page begins */}
        <section>
           

            <div className='create-box' >
            <h1 className='table-title'>News Section</h1>
            <button className='btn' onClick={()=> displayNewsCreate()}>Create News</button><br /> 
            {showCreateNews && <>
              <button className='btn-round' onClick={()=> displayNewsCreate()}><i class="fa-solid fa-xmark"></i></button>
            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewPostTitle(event.target.value); }} required/>
            <span className='placeholder'>Enter Post Title</span>
            </label>

            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewPostDate(event.target.value); }} required/>
            <span className='placeholder'>Enter Post Date</span>
            </label>

            <label className='label-field lined'>
            <input type='string'  onChange={(event) => { setNewSerialNumber(event.target.value); }} required/>
            <span className='placeholder'>Enter Serial Number e.g 1</span>
            </label>

            <label for="fname" className='txt'>Post body:</label>
            <textarea id="txtid" name="txtname" rows="6" cols="50" maxlength="200" onChange={(event) => { setNewPostBody(event.target.value); }} required>
            </textarea>
            <br />

            <button className='btn' onClick={createNews}>Create News</button>
            </>}  
            </div>

            <div className="">
             {news.map((news, index) => {
                return (
                  <div key={index} className='news'>
                  <section>
                      <p className='post-title'>{news.postTitle}</p>
                      <p className='news-date'>{news.postDate}</p>
                      <p className='news-date'>{news.serialNumo}</p>
                      <p className='news-body'>{news.postBody}</p>
                  </section>

                      <button className='is-sized' onClick ={()=> {deleteNews(news.id )}}><i className="fa-regular fa-trash-can"></i></button>&nbsp;&nbsp;
                      <button className='btn' onClick={()=> handleRedraft()}>Edit</button>

                        <section className='create-box' >
                            {changeNewsInput && <>

                                <label className='label-field lined'>
                                <input type='string'  onChange={(event) => { setNewPostTitle(event.target.value); }} required/>
                                <span className='placeholder'>Enter Post Title</span>
                                </label>

                                <label className='label-field lined'>
                                <input type='string'  onChange={(event) => { setNewPostDate(event.target.value); }} required/>
                                <span className='placeholder'>Enter Post Date</span>
                                </label>

                                <label className='label-field lined'>
                                <input type='string'  onChange={(event) => { setNewSerialNumber(event.target.value); }} required/>
                                <span className='placeholder'>Enter Serial Number e.g 1</span>
                                </label>

                                <label for="fname" className='txt'>Post body:</label>
                                <textarea id="txtid" name="txtname" rows="6" cols="50" maxlength="200" onChange={(event) => { setNewPostBody(event.target.value); }} required>
                                </textarea><br />
                            
                                <button className='btn' onClick={ ()=>{ updatePostTitle(news.id, news.postTitle); updatePostDate(news.id, news.postDate); updateSerialNumo(news.id, news.serialNumo); updatePostBody(news.id, news.postBody) }}> Update </button>
                            </>}
                        </section>
                    </div>
                )
             })}   
            </div>
        </section>



      </div>


       

   
  )
}

export default Admin

