import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./register.css"
let url="https://spacexserver.onrender.com/register"
let Register=()=>{ 
 const form_data = useRef();
 let navigate = useNavigate();
 async function reg_user(e){
        e.preventDefault()
        
        const data={
            email:form_data.current.email.value,
            password:form_data.current.password.value,
            confirmpassword:form_data.current.confirmpassword.value
        }
        if(data.password===data.confirmpassword){
             const response = await axios.post(url,data)
             console.log(response.status);
             if(response.status===200){
                navigate("/login")
             }
        }else{
            alert("passwords must be same")
        }
       
    }
    return(<>
          <div id="register">
            <form className="form-data" ref={form_data}>
                <div id="inputs">
                   <h1>Register</h1>
                  <input type="email" placeholder="email" id="email"/>
                  <input type="text" placeholder="password" id="password"/>
                  <input type="text" placeholder="confirmpassword" id="confirmpassword"/>
                  <button style={{marginLeft:"100px"}} onClick={reg_user} id="btn-reg">Register</button>
                </div>
            </form>
          </div>
    </>
    )
}
export default Register