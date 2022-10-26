import { useState, useEffect } from "react";
import { storage } from "./firebase-config";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import "./Gallery.css";

const Gallery = () => {

    // State to store uploaded file
//    const [file, setFile] = useState("");
   const [imageUrls, setImageUrls] = useState([]);

   const imagesListRef = ref(storage, '/files');
 
   // progress
//    const [percent, setPercent] = useState(0);

   // Handle file upload event and update state
//    function handleChange(event) {
//        setFile(event.target.files[0]);
//    }

//    const handleUpload = () => {
//        if (!file) {
//            alert("Please upload an image first!");
//        }

//        const storageRef = ref(storage, `/files/${file.name}`);

//        // progress can be paused and resumed. It also exposes progress updates.
//        // Receives the storage reference and the file to upload.
//        const uploadTask = uploadBytesResumable(storageRef, file);

//        uploadTask.on(
//            "state_changed",
//            (snapshot) => {
//                const percent = Math.round(
//                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                );

//                // update progress
//                setPercent(percent);
//            },
//            (err) => console.log(err),
//            () => {
//                // download url
//                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//                 setImageUrls((prev) => [...prev, url]);
                   
//                });
//            }
//        );
//    };

   
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

  const [model, setModel] = useState(false)
  const [tempUrl, setTempUrl] = useState(' ')

  const getImg = (url) => {
    setTempUrl(url)
    setModel(true);
  }


   return (
      <>
      
      <div className={model? 'model open' : 'model'}>
        <img src={tempUrl} alt="" />
        <button className="xmark-button" onClick={()=> setModel(false) }><i class="fa-solid fa-xmark"></i></button>
      </div>
       <div className="gallery">
           {imageUrls.map((url, index) => {
                 return (
                  <div className="pictures" key={index} onClick={()=> getImg(url)}>
                    <img src={url} alt='' />
                  </div>
                  
                 )
                
             })} 
        </div>

    </>
   );
            }


export default Gallery


/* <div className="App">
{imageUrls.map((url, index) => {
      return <img src={url} alt='' key={index + 1} />;
  })} 
</div> */