import React, { useState, useEffect } from 'react';
// Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';


import './Testimonials.css';
import avatar from "../assets/avtar.png";

// A custom hook to check screen size
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
};


const testimonialsData = [
  {
    name: 'Sudip Karmarkar',
    quote: 'What truly resonated with me about give.do was the platform\'s trustworthiness and the assurance that my donation would be used effectively. The ease of use, excellent customer support, and verified NGOs all contributed to a positive giving experience.',
    avatar: avatar,
    tagline: 'Joined the mission to turn compassion into action through giving and support.',
  },
  {
    name: 'Tejas Mahakal',
    quote: 'What truly resonated with me about give.do was the platform\'s trustworthiness and the assurance that my donation would be used effectively. The ease of use, excellent customer support, and verified NGOs all contributed to a positive giving experience.',
    avatar: avatar,
    tagline: 'Passionate about community welfare and sustainable development goals.',
  },
  {
    name: 'Aniket Mundhe',
    quote: 'What truly resonated with me about give.do was the platform\'s trustworthiness and the assurance that my donation would be used effectively. The ease of use, excellent customer support, and verified NGOs all contributed to a positive giving experience.',
    avatar: avatar,
    tagline: 'A true believer in collective good and empowering underprivileged.',
  },
];

// Helper component for a single card to avoid repetition
const TestimonialCard = ({ item }) => (
  <div className="testimonial-card">
    <p className="quote">"{item.quote}"</p> {/* Added quotes for style */}
    <div className="author-info">
      <img src={item.avatar} alt={item.name} className="author-avatar" />
      <div className="author-details">
        <p className="author-name">{item.name}</p>
        <p className="author-tagline">{item.tagline}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  
  const isDesktop = useMediaQuery('(min-width: 993px)');

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-background-overlay"></div>
      <div className="testimonials-content-wrapper">
        <h2 className="section-title">Here’s What People Say About <span className="highlight-word">Give</span></h2>

        {isDesktop ? (
          <div className="testimonial-cards-desktop">
            {testimonialsData.map((item, index) => (
              <TestimonialCard item={item} key={index} />
            ))}
          </div>
        ) : (
          
          <Swiper
            className="testimonial-swiper"
            modules={[Autoplay, Navigation]}
            // loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            slidesPerView={1.2}
            spaceBetween={20}
            centeredSlides={true}
            navigation={true}
          >
            {testimonialsData.map((item, index) => (
              <SwiperSlide key={index}>
                <TestimonialCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Testimonials;