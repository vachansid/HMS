
import React from "react";
import { useEffect,useState } from "react";
import axios from 'axios'

function ShowFiles(props)
{

     useEffect(()=>{
         getfiles();
     },[])
     const [filelist,setfilelist]=useState([])
     const getfiles=()=>{
        axios.get(`http://localhost:3001/Dentry/files/${props.PT_id}`).then(response=>{
            console.log(response.data)
            setfilelist(response.data)
        })
     }
     const [filename,setfilename]=useState("")
     const download=()=>{
        axios.get(`http://localhost:3001/Dentry/download/${props.PT_id}/${filename}`).then(response=>{
            console.log(response.data)
            setfilelist(...response.data[0])
        })
     }
    

    return(

        <div>
               {filelist.map((value,key)=>{
                return(<div>
                   {value}
                     <button onClick={()=>{setfilename(value);download();}}>Download</button> 
                </div>)
              })} 
        </div>
    )
}

export default ShowFiles;