import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { getMachineData, getMachineUser, loginService } from '../../../backservice/backservice';
import { useNavigate } from 'react-router-dom';

function MachindeData() {
  const isDarkMode = false;

  const [machineData, setMachineData] = useState({});
  const [user,setUser] = useState("")

  const mstatus = ['STOP', 'RUNNING', 'IDLE', 'ABORTED'];

  const navigate = useNavigate()

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  function getStatusColor(status) {
    switch (status) {
      case 'STOP':
        return 'text-red-500';
      case 'RUNNING':
        return 'text-green-500';
      case 'IDLE':
        return 'text-yellow-500';
      case 'ABORTED':
        return 'text-orange-300';
      default:
        return 'text-gray-500';
    }
  }

  const productionData = {
    labels: ['Good Count', 'Rejected Count'],
    datasets: [
      {
        data: [machineData?.d?.Good_Count || 0, machineData?.d?.Reject_Counters || 0],
        backgroundColor: ['#00FF00', '#FF0000'],
        borderColor: ['#00FF00', '#FF0000'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    circumference: 180,
    rotation: -90,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const oeeValue = machineData?.d?.current_OEE ? Number(machineData.d.current_OEE).toFixed(2) : '0.00';
  const performance = machineData?.d?.Performance ? Number(machineData.d.Performance).toFixed(2) : '0.00';
  const availability = machineData?.d?.Availability ? Number(machineData.d.Availability).toFixed(2) : '0.00';
  const quality = machineData?.d?.Quality ? Number(machineData.d.Quality).toFixed(2) : '0.00';

  const oeeData = {
    labels: ['Performance', 'Availability', 'Quality'],
    datasets: [
      {
        data: [performance, availability, quality],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  const oeeOptions = {
    circumference: 180,
    rotation: -90,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  useEffect(() => {
    const fetchdata = () => {
      getMachineData(serialNumber).then((data) => {
        setMachineData(data);
      });
      getMachineUser(serialNumber).then((data)=>{
          setUser(data)
      })
    };

    fetchdata();

    const intervalId = setInterval(() => {
      fetchdata();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [serialNumber]);

  return (
    <>
    <div>
      <div className='bg-indigo-400 w-3 h-6'>

      </div>
    </div>
    </>
  );
}

export default MachindeData;