import {React,  createRef} from 'react'

const FileUpload =()=>{
    const fileInput = createRef();
     const onSubmit = async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.set("avatar", fileInput.current.value)

        try{
            const response= await fetch ('http://localhost:3001/user/upload' , {
                method: 'POST',
                body: formData
            })
            const parsedResponse =await response.json();
            if(response.ok){
                alert("File uploaded!")
            } 
            else{
                console.log("Some error occured")
                console.log(error)
            }
           
        
        }
        catch(e){
            console.log(e.message)
        }
     }

     return (
        <>
        <div className="file">
            <form onSubmit={onSubmit}>
            <input type="file" name="avatar" ref ={fileInput} />
            <input type="submit" value="Submit"/>
            </form>
        </div>
        </>
     )

}

export default FileUpload