
import firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from "react";
import './App.css';
import firebaseConfig from './firebase.config';




firebase.initializeApp(firebaseConfig);
function App() {

const [newUser, setnewUser] = useState(false);
const [user, setUser] = useState({
  isSignedIn:false,
  name:'',
  email:'',
  password:'',
  photo:''
});
const googleProvider = new firebase.auth.GoogleAuthProvider();
const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSingIn=()=>{
    firebase.auth().signInWithPopup(googleProvider)
  .then((result) => {
    const {displayName,photoURL,email}=result.user;
    const signedInUser={
      isSignedIn:true,
      name:displayName,
      email:email,
      photo:photoURL
    }
    setUser(signedInUser);
  }).catch((error) => {
    console.log(error);
    console.log(error.message);
  });
  }

const handleFbSingIn=()=>{
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
  
    console.log('Fb user aftter sing in ',user)
    

  })
  .catch((error) => {
  
  });
}


const handleSingOut=()=>{
  firebase.auth().signOut()
  .then((result) => {
    const singedOutUser={
  isSignedIn:false,
  name:'',
  email:'',
  photo:'',
  error:'',
  success:false
    }
    setUser(singedOutUser);
  }).catch((error) => {
    // An error happened.
  });
}



const handleBlur=(e)=>{
let isFromValid=true;
if(e.target.name==='email'){
 isFromValid= /\S+@\S+\.\S+/.test(e.target.value);

}
if(e.target.name ==='password'){
const isPasswordValid= e.target.value.length>8;
const passwordHash= /\d{1}/.test(e.target.value);
isFromValid=isPasswordValid && passwordHash;
}
if(isFromValid){
  const newUserInfo={...user};
  newUserInfo[e.target.name]=e.target.value;
  setUser(newUserInfo);
}
}
const handleSubmit=(e)=>{
if(newUser&&user.email && user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((res) => {
  const newUserInfo={...user};
  newUserInfo.error='';
  newUserInfo.success=true;
  setUser(newUserInfo);
  UpdateUserName(user.name);
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);

  });
}
if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
  const newUserInfo={...user};
  newUserInfo.error='';
  newUserInfo.success=true;
  setUser(newUserInfo);
  console.log('SingIn  User Info ',res.user);
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
  });
}

e.preventDefault();
}


const UpdateUserName =name=>{
  const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
  
}).then(() => {
  console.log('User Name Updated Successfully')
}).catch((error) => {
  console.log(error)
});  
}


const verifyEmail=()=>{
  firebase.auth().currentUser.sendEmailVerification()
  .then(() => {
    // Email verification sent!
    // ...
  });
}



const resetpassword=email=>{
  firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
   console.log(errorMessage,errorCode)
  });
}


  return (
    <div className="App">
      {
        user.isSignedIn ?<button onClick={handleSingOut}> Sign out</button> :  <button onClick={handleSingIn}> Sign in</button>
      }
     <br/>
     <button onClick={handleFbSingIn}>Sing In Using Facebook </button>
      {
      user.isSignedIn &&
      <div>
       <p>Welcome {user.name}</p>
       <p>Your Email : {user.email}</p>
       <img src={user.photo} alt=""></img>
      </div>
      } 

     <h1>Our Own Authentication</h1>
     <input type="checkbox" onChange={(()=>setnewUser(!newUser))} name ="newUser" />
     <label htmlFor="newUser">New User Sing UP</label>
     <form onSubmit={handleSubmit}>
      {newUser&&<input type="text" name="name" onBlur={handleBlur} placeholder="Your Name" required />}
      <br/>
     <input type="text"  name="email" onBlur={handleBlur} placeholder="Your Email Adress" required />
     <br/>
     <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required />
     <br/>
     <input type="submit" value={newUser?'Sing UP':'Sing In'} />
     </form>
     
   <br/><button onClick={()=>resetpassword(user.email)}>Forget password</button>
     <p style={{color:'red'}}>{user.error}</p>
     {user.success && <p style={{color:'green'}}>User {newUser?'Created' :'Logged In'} Success</p>}
    </div>
  );
}

export default App;
