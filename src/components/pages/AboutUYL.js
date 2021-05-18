import React from 'react'
import '../../public/css/About.scss'

const AboutUYL = () => {
    
    document.title = "About"

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 about-title r-font">
                    <div className="small">About</div>
                    <p>Up Your Link</p>
                </div>
                <div className="col-md-6 about-description k-font">
                    <div>
                        <span className="link">Up your link</span> is a social enviroment where you have the posibility to share your own multimedia files
                        creating custom pages that anyone can easily access. You can see how many people visit your pages,
                        how many views have and the rating that each persons do of your sites.
                    </div>
                </div>
                <div className="col-md-6 about-features-content k-font row">
                    <div className="col-6 center">
                        <i className="fas fa-link fa-fw fa-2x about-icon"/>
                        <p>Getting unique URL's</p>
                    </div>
                    <div className="col-6 center">
                        <i className="fas fa-chart-pie fa-fw fa-2x about-icon" />
                        <p>Visualize analytics in real time </p>
                    </div>
                    <div className="col-6 center">
                        <i className="fas fa-user-plus fa-fw fa-2x about-icon" />
                        <p>Follow people to get more content </p>
                    </div>
                    <div className="col-6 center">
                        <i className="fas fa-star fa-fw fa-2x about-icon" />
                        <p>Rating sites </p>
                    </div>

                </div>
                <div className="col-md-6 about-features r-font my-auto">
                    <p>Features</p>
                </div>

            </div>

        </div>

    )
}

export default AboutUYL
