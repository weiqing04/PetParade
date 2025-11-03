// about.js
import React from "react";
import "./About.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <img
          src="/1600w-KBBZLdpjLcM.webp" // Replace with your desired image path
          alt="Header"
          className="about-header-image"
        />
        <div className="header-text-overlay">
          <h1 className="header-title">Pet Parade</h1>
          <p className="header-description">
            A sanctuary of premium pet essentials, thoughtfully curated with care, elegance, and dedication.
          </p>
        </div>
      </header>

      <main className="about-main">
        <section className="services-section">
          <h2 className="services-title">Our Services</h2>
          <p className="services-description">
            We offer a wide range of premium services for you and your furry companions.
          </p>
          <div className="services-grid">
            <div className="service-card">
              <img src="/petaccessories.jpg" alt="Pet Accessories" className="service-image" />
              <h3 className="service-title">Pet Accessories</h3>
              <p className="service-description">
                Discover a wide range of high-quality pet essentials
              </p>
            </div>
            <div className="service-card">
              <img src="/stackleather.jpg" alt="Customization Services" className="service-image" />
              <h3 className="service-title">Customization Services</h3>
              <p className="service-description">
                Add a unique touch to your pet’s style and needs.
              </p>
            </div>
            <div className="service-card">
              <img src="/dog.jpg" alt="Our Tips" className="service-image" />
              <h3 className="service-title">Our Tips</h3>
              <p className="service-description">
                Handy tips for using our products.
              </p>
            </div>
          </div>
        </section>

        {/* New Section: Image on the left and description on the right */}
        <section className="image-description-section">
          <img
            src="/050a1a3cfac4c857105469438327eaa7.jpg" // Replace with your desired image path
            alt="Cat"
            className="description-image"
          />
          <div className="description-content">
            <h2 className="description-title">About Us</h2>
            <p className="description-text">
              Pet Parade is born out of a passion for enhancing the lives of pets and their owners. We provide top-quality pet accessories and products, ensuring your furry friends receive the care and comfort they deserve. From delightful treats to functional gear, every item is thoughtfully selected to meet your pet's needs.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section class="team-section">
          <h2 class="team-title">Meet Our Purr-fect Team</h2>
          <p class="team-description">
            Our Amazing team of animal lovers who work tirelessly to keep everything running smoothly.
          </p>
          <div class="team-grid">
            <div class="team-card">
              <img src="/midnight.jpg" alt="Worker 1" class="team-image" />
              <h3 class="team-name">Jun Hao</h3>
              <p class="team-role">Front-End Developer</p>
              <p class="team-bio">
                Hola, I brings the user interface to life with seamless designs and interactive elements, hope you enjoy it!
              </p>
            </div>
            <div class="team-card">
              <img src="/worker2.jpg" alt="Worker 2" class="team-image" />
              <h3 class="team-name">Jiong Ming</h3>
              <p class="team-role">Back-End Developer</p>
              <p class="team-bio">
                My name is Jiong Ming, you can call me JM. Although my profile picture looks very angry but I'm a very friendly person.
                My role is to ensures the website runs smoothly with efficient server-side solutions.
              </p>
            </div>
            <div class="team-card">
              <img src="/worker3.jpg" alt="Worker 3" class="team-image" />
              <h3 class="team-name">Wei Qing</h3>
              <p class="team-role">UX/UI Designer</p>
              <p class="team-bio">
                Hello! I specialize in creating visually stunning and user-friendly designs to provide an enjoyable experience for our users. My mission is to ensure that every interaction with Pet Parade feels seamless and delightful!
              </p>
            </div>
            <div class="team-card">
              <img src="/worker4.jpg" alt="Worker 4" class="team-image" />
              <h3 class="team-name">Xin Jing</h3>
              <p class="team-role">Content Strategist</p>
              <p class="team-bio">
              My name is Yeoh Xin Jing. I'm working on the content strategies for Pet Parade Shop which focus on engaging pet lovers through captivating visuals, informative posts, and interactive campaigns to build a loyal and vibrant community.
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default AboutUs;
