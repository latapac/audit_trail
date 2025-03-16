import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMachines, logoutService } from '../../backservice/backservice';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const userData = useSelector((state) => state.authSlice.userData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [machinesList, setMachinesList] = useState([]);
  const [machineData, setMachineData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  // OEE Data
  const oeeValue = 99;
  const performance = 90;
  const availability = 85;
  const quality = 75;

  // Production Data
  const totalProduction = 480;
  const goodProduction =  280;
  const badProduction = 200;

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
        });
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
    <div className='bg-gray-200 h-auto min-h-screen overflow-hidden'>
      <div>
        <div className='bg-blue-400 h-9'>
          <img src="" alt="" />
          <p className='text-2xl'>PACMAC</p>
        </div>
      </div>
      <div className='flex flex-row justify-evenly bg-gray-200 mt-1'>
        <div className='bg-white w-[30vh] flex justify-center'>Home</div>
        <div className='bg-white w-[30vh] flex justify-center'>Analytics</div>
        <div className='bg-white w-[30vh] flex justify-center'>Devices</div>
        <div className='bg-white w-[30vh] flex justify-center'>Reports</div>
        <div className='bg-white w-[30vh] flex justify-center'>Status</div>
        <div className='bg-blue-500 rounded-sm text-white w-[20vh] flex justify-center'>Sync</div>
      </div>
      <div className='bg-gray-200 h-6'></div>
      <div className='flex flex-row w-screen h-36'>
        <div className='w-60 h-46 bg-white'>
          <img src="../../../public/filling-sealing-machine.jpg" alt="" className='h-full' />
        </div>
        <div className='flex flex-col w-full gap-3'>
          <div className='flex flex-row justify-evenly'>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1><button className='bg-green-600 text-white pl-9 pr-9 pt-2 text-2xl pb-2 rounded-md'>RUN</button></h1><p>Status</p>
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold text-yellow-600'>{totalProduction}</h1> <p>Total Production</p>
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold text-green-600'>{goodProduction}</h1> <p>Good Production</p> 
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold text-red-600'>{badProduction}</h1><p>Bad Production</p>
            </div>
          </div>
          <div className='flex flex-row justify-evenly'>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>Batch025</h1> <p>Batch Number</p>
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>{oeeValue}</h1><p>OEE </p>
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>78</h1> <p>Current Speed</p>
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>Pacmac</h1> <p>Recipe Number</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row w-screen h-40 gap-7 mt-16 ml-7'>
        {/* OEE Graph */}
        <div className='bg-white w-[46vw] h-84 flex'>
          <div className={`rounded-lg shadow-md p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold md:text-xl mb-3 md:mb-4 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Overall Equipment Effectiveness
            </h3>
            <div className="relative aspect-square max-h-96 mx-auto">
              <div className="absolute inset-0">
                <Bar
                  data={{
                    labels: ['Availability', 'Performance', 'Quality'],
                    datasets: [
                      {
                        label: 'OEE Components',
                        data: [availability, performance, quality],
                        backgroundColor: [
                          isDarkMode ? 'rgba(99, 102, 241, 0.8)' : 'rgba(59, 130, 246, 0.8)',
                          isDarkMode ? 'rgba(244, 114, 182, 0.8)' : 'rgba(236, 72, 153, 0.8)',
                          isDarkMode ? 'rgba(52, 211, 153, 0.8)' : 'rgba(16, 185, 129, 0.8)',
                        ],
                        borderColor: [
                          isDarkMode ? 'rgba(99, 102, 241, 1)' : 'rgba(59, 130, 246, 1)',
                          isDarkMode ? 'rgba(244, 114, 182, 1)' : 'rgba(236, 72, 153, 1)',
                          isDarkMode ? 'rgba(52, 211, 153, 1)' : 'rgba(16, 185, 129, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                        },
                        grid: {
                          color: isDarkMode ? 'rgba(55, 65, 81, 1)' : 'rgba(229, 231, 235, 1)',
                        },
                      },
                      x: {
                        ticks: {
                          color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                        },
                        grid: {
                          color: isDarkMode ? 'rgba(55, 65, 81, 1)' : 'rgba(229, 231, 235, 1)',
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Production Graph */}
        <div className='bg-white w-[46vw] h-84 flex'>
          <div className={`rounded-lg shadow-md p-4 w-[40vw] ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold md:text-xl mb-3 md:mb-4 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Production Overview
            </h3>
            <div className="relative aspect-square max-h-96 mx-auto">
              <div className="absolute inset-0">
                <Bar className='w-[40vw]'
                  data={{
                    labels: ['Total Production', 'Good Production', 'Bad Production'],
                    datasets: [
                      {
                        label: 'Production',
                        data: [totalProduction, goodProduction, badProduction],
                        backgroundColor: [
                          isDarkMode ? 'rgba(99, 102, 241, 0.8)' : 'rgba(59, 130, 246, 0.8)',
                          isDarkMode ? 'rgba(52, 211, 153, 0.8)' : 'rgba(16, 185, 129, 0.8)',
                          isDarkMode ? 'rgba(244, 114, 182, 0.8)' : 'rgba(236, 72, 153, 0.8)',
                        ],
                        borderColor: [
                          isDarkMode ? 'rgba(99, 102, 241, 1)' : 'rgba(59, 130, 246, 1)',
                          isDarkMode ? 'rgba(52, 211, 153, 1)' : 'rgba(16, 185, 129, 1)',
                          isDarkMode ? 'rgba(244, 114, 182, 1)' : 'rgba(236, 72, 153, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                        },
                        grid: {
                          color: isDarkMode ? 'rgba(55, 65, 81, 1)' : 'rgba(229, 231, 235, 1)',
                        },
                      },
                      x: {
                        ticks: {
                          color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                        },
                        grid: {
                          color: isDarkMode ? 'rgba(55, 65, 81, 1)' : 'rgba(229, 231, 235, 1)',
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;