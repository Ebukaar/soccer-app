import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import "./Clubs.css";
import { db } from "./firebase-config";
import { storage } from "./firebase-config";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";


const Clubs = () => {
    const clubsCollectionRef = collection(db, "clubs");
    // const [newClubInfo, setNewClubInfo] = useState("");
    // const [newClubName, setNewClubName] = useState("");

    const [clubs, setClubs] = useState([]);

    // const [showCreateClub, setShowCreateClub] = useState(false)
    // const displayClub = () => {
    //   return setShowCreateClub(!showCreateClub)
    // }

    // State to store uploaded files
    const [logo, setLogo] = useState('')
    const [imageLinks, setImageLinks] = useState([])

    const logoListRef = ref(storage, '/logos');

    // To reset the Input tag
    // const inputTagRef = useRef(null)

    // // To show Progress
    // const [percentage, setPercentage] = useState(0);
    
    // // For adding logos
    // // Handle file upload event and update state
    // function handleReplace(event) {
    //     setLogo(event.target.files[0]);
    // }

    // const handleTransmit = () => {
    //     if (!logo) {
    //         alert('Please upload an image first');
    //     }

    // const logoStorageRef = ref(storage, `/logos/${logo.name}`);


    //  // progress can be paused and resumed. It also exposes progress updates.
    //  // Receives the storage reference and the file to upload.
    //  const uploadMission = uploadBytesResumable(logoStorageRef, logo);

    //  uploadMission.on(
    //     'state_changed',
    //     (snapshot) => {
    //         const percentage = Math.round(
    //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //         );

    //         // update progress
    //         setPercentage(percentage);
    //     },
    //     (err) => console.log(err),
    //     () => {
    //         //download url
    //         getDownloadURL(uploadMission.snapshot.ref).then((url) => {
    //             setImageLinks((prev) => [...prev, url]);
    //             resetLogoFileInput()
    //         });
    //     }
    //  )
    // }
    
    // To clear the input tag after upload
    // const resetLogoFileInput = () => {
    //     // This will reset the input tag
    //     inputTagRef.current.value = null;
    // }

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

    // const createClubAndInfo = async () => {
    //     await addDoc(clubsCollectionRef, {
    //       clubInfo : newClubInfo,
    //       clubName: newClubName,
    //     })
    //     .then(()=>{
    //       // alert('Entry succesful');
    //       // forceUpdate()
    //       window.location.reload(false);
    //     })
    //     .catch((error)=>{
    //       alert('Unsuccessful operation, error:'+error);
    //     });
    //   };

    //   const [changeInput, setChangeInput] = useState(false)
    //     const handleEdit = () => {
    //     return setChangeInput(!changeInput)
    //     }

      // Update ClubName
//     const updateClubName = async (id, clubName) => {
//     const clubDoc = doc(db, 'clubs', id)
//     const newEntry = { clubName: newClubName }
//     await updateDoc(clubDoc, newEntry)
//     .then (()=>{
//       // forceUpdate()
//       window.location.reload(false);
//     })
//     .catch((error)=>{
//       alert('Unsuccessful operation, error:'+error);
//     });
//   }

//   Update Club Info
// const updateClubInfo = async (id, clubInfo ) => {
//     const clubDoc = doc(db, 'clubs', id)
//     const newEntry = {clubInfo: newClubInfo}
//     await updateDoc(clubDoc, newEntry)
//     .then (()=>{
//         // forceUpdate()
//         window.location.reload(false);
//       })
//       .catch((error)=>{
//         alert('Unsuccessful operation, error:'+error);
//       });
//     }

    // const deleteClub = async (id) => {
    //     const clubDoc = doc(db, 'clubs', id)
    //     await deleteDoc(clubDoc)
    //     .then(()=>{
    //       // alert('Point reduced');
    //       // forceUpdate()
    //       window.location.reload(false);
    //     })
    //     .catch((error)=>{
    //       alert('Unsuccessful operation, error:'+error);
    //     });
      
    //   }

    //   To delete Logo
    // const deleteLogos = (url) => {
    //     let logoRef = ref(storage, (url));
    //     deleteObject(logoRef)
    //     .then(() => {
    //         setImageLinks(imageLinks.filter((logo) => logo !==url));
    //         alert('Picture is deleted succesfully!');
    //         window.location.reload(false);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         alert('Unsuccesful operation, error:' +err); 
    //     })
    // }


      useEffect(() => {
        const getClubs = async () => {
          const data = await getDocs(clubsCollectionRef)
          
          // console.log(data);
          setClubs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getClubs();
      }, []);
    

  return (
    <section className="section-club">
      <div className="is-centered">
        {imageLinks.map((url, index) =>{

            return (
                <>
                <img className="club-images" src={url} alt='' key={index} />
                </>
            ) 
        })}
      </div>

      <div className="club-card">
        {clubs.map((club, index) => {
            return (
                <div className='' key={index}>
                    <h1>{club.clubName}</h1>
                    <p>{club.clubInfo}</p>
               
                </div> 
            )})}   
      </div>
    </section>
  );
        
};

export default Clubs;


