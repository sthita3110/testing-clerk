import React from 'react'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'


const Header = () => {
  return (
    <>
    <div style={{backgroundColor:"lightblue", height:"50px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <nav>
            <p>Team name</p>
        </nav>
        <div className="header-auth" style={{marginRight:"10px"}}>
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
        </div>
    </div>
    </>
  )
}

export default Header