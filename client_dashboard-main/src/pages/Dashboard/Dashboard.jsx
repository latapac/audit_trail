import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMachines, logoutService } from '../../backservice/backservice';
import 'chart.js/auto';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import logo from "/logo.png"
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const userData = useSelector((state) => state.authSlice.userData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [machinesList, setMachinesList] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation()

  const dropdownRef = useRef(null);

  const memoizedOutlet = useMemo(() => (
    <Outlet />
  ), []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userData?.c_id) {
      getMachines(userData.c_id)
        .then((data) => {
          if (data) {
            setMachinesList(data);
          }
        })
        .catch(() => {
          console.log('machines fetch failed');
        })
        .finally(() => { });
    }
  }, [userData?.c_id]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    if (logoutService()) {
      navigate('/login');
    }
  };

  return (
    <>
      <div className='bg-gray-200 h-auto min-h-screen overflow-hidden'>
        <div>
          <div className='bg-blue-400 h-9'>
            <img src="" alt="" />
            <p>PACMAC</p>
          </div>
        </div>
          <div className='flex flex-row justify-evenly bg-gray-200 mt-1'>
            <div className='bg-white  w-[30vh] flex justify-center '>Home</div>
            <div className='bg-white  w-[30vh] flex justify-center '>Analytics</div>
            <div className='bg-white  w-[30vh] flex justify-center '>Devices</div>
            <div className='bg-white  w-[30vh] flex justify-center '>Reports</div>
            <div className='bg-white  w-[30vh] flex justify-center '>Status</div>
            <div className='bg-blue-500 rounded-sm text-white  w-[20vh] flex justify-center '>Sync</div>
          </div>
          <div className='bg-gray-200 h-6'></div>
          <div className=' flex flex-row w-screen h-36'>
            <div className='w-60  h-46 bg-white'></div>
            <div className='flex flex-col w-full gap-3'>
              <div className='flex flex-row justify-evenly'>
                <div className='bg-white w-62 h-22'>div1</div>
                <div className='bg-white w-62 h-22'>div2</div>
                <div className='bg-white w-62 h-22'>div3</div>
                <div className='bg-white w-62 h-22'>div4</div>
              </div>
              <div className='flex flex-row justify-evenly'>
                <div className='bg-white w-62 h-22'>div5</div>
                <div className='bg-white w-62 h-22'>div6</div>
                <div className='bg-white w-62 h-22'>div7</div>
                <div className='bg-white w-62 h-22'>div8</div>
              </div>
            </div>
          </div>
          <div className='flex flex-row  w-screen h-40 gap-7 mt-16 ml-7'>
            <div className='bg-white w-[46vw] h-84 flex'></div>
            <div className='bg-white w-[46vw] h-84 flex'></div>
          </div>
          
      </div>
      
    </>
  );
}

export default Dashboard;