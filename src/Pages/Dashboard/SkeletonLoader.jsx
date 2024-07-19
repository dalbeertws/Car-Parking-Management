import React from 'react'
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonLoader() {
    const arr = Array.from({length: 840}, (v, i) => i);

  return (
    <div className='skeleton-section'>

        <div
            style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "center",
               gap: "5px",
            }}
            >
        {
    arr.map((item) => {
        return(

            <Skeleton animation="wave" variant="rounded" className='skeleton' />

        )
    })
}
</div>

    </div>
  )
}
