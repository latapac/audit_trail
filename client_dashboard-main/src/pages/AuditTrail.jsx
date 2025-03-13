import React, { useEffect, useState } from 'react'
import logo from '/logo.png'
import { getAuditTrailData } from '../backservice/backservice'
import { useLocation } from 'react-router-dom'

function AuditTrail() {

  const [data, setData] = useState()


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');
  console.log(serialNumber);


  useEffect(() => {
    getAuditTrailData(serialNumber).then((adata) => {
      if (adata) {
        console.log();
        
        setData(adata)
      }
    })
  }, [])

  return (
    <>
      <div className='flex flex-col overflow-hidden'>
        <div className='p-2 w-screen bg-blue-400 flex flex-row '>
          <img src={logo} alt="" className=' h-9 w-9' /><h2 className='pl-2 font-medium font-serif text-3xl'>PACMAC</h2>
        </div>
        <hr className='h-0.5 bg-white' />
        <div className='flex'>
          <div className='bg-blue-400 h-screen w-[16vw] flex flex-col '>
            <button className='font-medium text-xl border-b-2 border-t-1 p-1.5 rounded-xl mt-[10vh] hover:bg-blue-700 hover:text-white'>Audit Report</button>
            <button className='font-medium text-xl border-b-2 border-t-1 p-1.5 rounded-xl mt-[2vh]  hover:bg-blue-700 hover:text-white'>Batch Report</button>
          </div>
          <div className='flex m-5'>
            <table>
              <thead>
                <tr className='flex gap-7 justify-between'>
                  <th>Timestamp</th>
                  <th>Topic Name</th>
                  
                </tr>
              </thead>
              <tbody>
                {data?.map((data) => {
                  return (
                    <tr className='flex gap-7' key={data._id}>
                      <td>{data?.ts}</td>
                      <td>{data?.topic}</td>
                      {/* <td>{data?.d?.}</td> */}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </>
  )
}

export default AuditTrail
