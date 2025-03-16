import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
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

  const oeeValue = machineData?.d?.current_OEE ? Number(machineData.d.current_OEE).toFixed(2) : '0.00';
  const performance = machineData?.d?.Performance ? Number(machineData.d.Performance).toFixed(2) : '0.00';
  const availability = machineData?.d?.Availability ? Number(machineData.d.Availability).toFixed(2) : '0.00';
  const quality = machineData?.d?.Quality ? Number(machineData.d.Quality).toFixed(2) : '0.00';
  const Total_Production = machineData?.d?.Performance ? Number(machineData.d.Total_Production).toFixed(2) : '0.00';
  const Good_Count = machineData?.d?.Availability ? Number(machineData.d.Good_Count).toFixed(2) : '0.00';
  const Reject_Counters = machineData?.d?.Quality ? Number(machineData.d.Reject_Counters).toFixed(2) : '0.00';

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
          <p>PACMAC</p>
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
              <h1><button className='bg-green-600 text-white pl-6 pr-6 pt-3 pb-3'>RUN</button></h1>RUN
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold text-yellow-600'>4500</h1>Total Production
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold text-green-600'>4000</h1>Good Production
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold text-red-600'>500</h1>Bad Production
            </div>
          </div>
          <div className='flex flex-row justify-evenly'>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>Batch025</h1>Batch Number
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>67</h1>OEE
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>78</h1>Current Speed
            </div>
            <div className='bg-white w-62 h-22 flex flex-col justify-center items-center'>
              <h1 className='text-3xl font-semibold'>Pacmac</h1>Recipe Number
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row w-screen h-40 gap-7 mt-16 ml-7'>
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
        <div className='bg-white w-[46vw] h-84 flex'>
        <div className={`rounded-lg shadow-md p-4 h-[50vh] w-[40vw] ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold md:text-xl mb-3 md:mb-4 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Production Details
            </h3>
            <div className="relative aspect-square max-h-56  w-40 mx-auto">
              <div className="absolute inset-0">
                <Bar className='max-h-56  w-40 mx-auto'
                  data={{
                    labels: ['Total Production', 'Good Production', 'Bad Production'],
                    datasets: [
                      {
                        label: 'OEE Components',
                        data: [Total_Production, Good_Count, Reject_Counters],
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
      </div>
    </div>
  );
}

export default Dashboard;