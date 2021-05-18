import React from 'react'
import { useSelector } from 'react-redux'
/* import defaultThumbDark from '../../public/img/noThumb-dark.png'
import defaultThumbLight from '../../public/img/noThumb-light.png' */

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const LoadingSkeleton = ({ times, type, numberRows }) => {

    const { darkMode } = useSelector(state => state.auth.bools)

    const skeletonsId = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    const skeletons1 = skeletonsId.filter((sk, c) => c <= times ? sk : null).map((sk) => {
        return <div key={sk} className="p-2 userSite col-12 col-sm-6 col-md-4 col-lg-3">
            <SkeletonTheme color={!darkMode ? null : "#383b3d"} highlightColor={!darkMode ? null : "#4f5457"}>
                <Skeleton height={125} style={{ marginBottom: "5px" }} />
                <Skeleton count={numberRows} />
            </SkeletonTheme>
        </div>
    })

    const skeletons2 = skeletonsId.filter((sk, c) => c <= times ? sk : null).map((sk) => {
        return <div key={sk} className="userSite col-12 col-sm-6 col-md-3 col-lg-2 p-1">
            <SkeletonTheme color={!darkMode ? null : "#383b3d"} highlightColor={!darkMode ? null : "#4f5457"}>
                <div className="w-100">
                    <Skeleton height={100} style={{ marginBottom: "5px" }} />
                </div>
                <Skeleton count={numberRows} />
            </SkeletonTheme>
        </div>
    })

    const getSkeleton = (to) => {
        if (to === "dashboard") {
            return <div className="d-flex dashboard-hideElements">
                {skeletons1}
            </div>
        }
        else if (to === "detailUser") {
            return <div className="row mt-3 m-0">
                {skeletons2}
            </div>
        }
        return null
    }

    return (
        getSkeleton(type)
    )
}

export default LoadingSkeleton