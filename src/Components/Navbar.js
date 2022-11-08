import React, { useState  } from 'react';
import { Link } from 'react-router-dom'
import './navbar.css'
import "./Footer.css";
import { FaBars } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'

const Navbar = () => {
    const [Mobile, setMobile] = useState(false)
    
    return (
        <nav className="navbar">
            {/* <div className='container'> */}
            <Link to='/'><h3 className='logo'>Champs</h3> </Link>

           <ul className= {Mobile ? 'nav-links-mobile' :'nav-links'} onClick ={() => setMobile(false)}  >
            <Link to='/'> <li> Home </li> </Link>
            <Link to='/clubs'> <li> Clubs </li> </Link>
            <Link to='/fixtures'> <li> Fixtures </li> </Link>
            <Link to='/gallery'> <li> Gallery </li> </Link>
            <Link to='/news'> <li> News </li> </Link>
            <Link to='/results'> <li> Results </li> </Link>
           </ul>
           {/* className= {Mobile ? 'mobile-menu-icon footer-container-hamburger' :'mobile-menu-icon footer-container'} */}
           <button className='mobile-menu-icon' onClick={ ()=> setMobile(!Mobile)}>
            {Mobile ? <ImCross/>  : <FaBars />  } 
            </button>
           
           {/* </div> */}
        </nav>
    )
}

export default Navbar