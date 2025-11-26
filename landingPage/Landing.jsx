import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  IoLocationOutline, 
  IoTimeOutline, 
  IoCallOutline, 
  IoMailOutline,
  IoCloseOutline,
  IoChevronBack,
  IoChevronForward,
  IoChevronUp,
  IoChevronDown,
  IoPersonOutline,
  IoCalendarClearOutline
} from 'react-icons/io5';
import './assets/css/style.css';

// Import des images
import logo from './assets/images/logo.svg';
import heroSlider1 from './assets/images/hero-slider-1.jpg';
import heroSlider2 from './assets/images/hero-slider-2.jpg';
import heroSlider3 from './assets/images/hero-slider-3.jpg';
import heroIcon from './assets/images/hero-icon.png';
import service1 from './assets/images/service-1.jpg';
import service2 from './assets/images/service-2.jpg';
import service3 from './assets/images/service-3.jpg';
import shape1 from './assets/images/shape-1.png';
import shape2 from './assets/images/shape-2.png';
import shape3 from './assets/images/shape-3.png';
import aboutBanner from './assets/images/about-banner.jpg';
import aboutAbsImage from './assets/images/about-abs-image.jpg';
import badge2 from './assets/images/badge-2.png';
import specialDishBanner from './assets/images/special-dish-banner.jpg';
import badge1 from './assets/images/badge-1.png';
import shape4 from './assets/images/shape-4.png';
import shape9 from './assets/images/shape-9.png';
import menu1 from './assets/images/menu-1.png';
import menu2 from './assets/images/menu-2.png';
import menu3 from './assets/images/menu-3.png';
import menu4 from './assets/images/menu-4.png';
import menu5 from './assets/images/menu-5.png';
import menu6 from './assets/images/menu-6.png';
import shape5 from './assets/images/shape-5.png';
import shape6 from './assets/images/shape-6.png';
import testiBg from './assets/images/testimonial-bg.jpg';
import testiAvatar from './assets/images/testi-avatar.jpg';
import formPattern from './assets/images/form-pattern.png';
import featuresIcon1 from './assets/images/features-icon-1.png';
import featuresIcon2 from './assets/images/features-icon-2.png';
import featuresIcon3 from './assets/images/features-icon-3.png';
import featuresIcon4 from './assets/images/features-icon-4.png';
import shape7 from './assets/images/shape-7.png';
import shape8 from './assets/images/shape-8.png';
import event1 from './assets/images/event-1.jpg';
import event2 from './assets/images/event-2.jpg';
import event3 from './assets/images/event-3.jpg';
import footerBg from './assets/images/footer-bg.jpg';

const RestaurantTemplate = () => {
  // États
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isBackTopVisible, setIsBackTopVisible] = useState(false);
  
  // Références
  const headerRef = useRef(null);
  const navbarRef = useRef(null);
  const overlayRef = useRef(null);
  const backTopBtnRef = useRef(null);
  const autoSlideRef = useRef(null);
  const lastScrollPos = useRef(0);
  const parallaxRefs = useRef([]);

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.add('loaded');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Navigation toggle
  const toggleNavbar = useCallback(() => {
    setIsNavbarActive(prev => !prev);
  }, []);

  useEffect(() => {
    if (navbarRef.current) {
      if (isNavbarActive) {
        navbarRef.current.classList.add('active');
        overlayRef.current?.classList.add('active');
        document.body.classList.add('nav-active');
      } else {
        navbarRef.current.classList.remove('active');
        overlayRef.current?.classList.remove('active');
        document.body.classList.remove('nav-active');
      }
    }
  }, [isNavbarActive]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (scrollY >= 50) {
        headerRef.current?.classList.add('active');
        setIsBackTopVisible(true);
        
        // Hide header on scroll down
        const isScrollBottom = lastScrollPos.current < scrollY;
        if (isScrollBottom && scrollY > 100) {
          headerRef.current?.classList.add('hide');
          setIsHeaderHidden(true);
        } else {
          headerRef.current?.classList.remove('hide');
          setIsHeaderHidden(false);
        }
        
        lastScrollPos.current = scrollY;
      } else {
        headerRef.current?.classList.remove('active');
        setIsBackTopVisible(false);
        setIsHeaderHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Slider
  const totalSlides = 3;

  const slideNext = useCallback(() => {
    setCurrentSlide(prev => (prev >= totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const slidePrev = useCallback(() => {
    setCurrentSlide(prev => (prev <= 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto slide
  useEffect(() => {
    autoSlideRef.current = setInterval(slideNext, 7000);
    
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [slideNext]);

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  };

  const startAutoSlide = () => {
    autoSlideRef.current = setInterval(slideNext, 7000);
  };

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      let x = (event.clientX / window.innerWidth * 10) - 5;
      let y = (event.clientY / window.innerHeight * 10) - 5;

      // Reverse the number
      x = x - (x * 2);
      y = y - (y * 2);

      parallaxRefs.current.forEach(item => {
        if (item) {
          const speed = Number(item.dataset?.parallaxSpeed) || 1;
          const finalX = x * speed;
          const finalY = y * speed;
          item.style.transform = `translate3d(${finalX}px, ${finalY}px, 0px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const addToParallaxRefs = (el) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el);
    }
  };

  // Menu Items Data avec images importées
  const menuItems = [
    {
      id: 1,
      name: "Greek Salad",
      price: "$25.50",
      description: "Tomatoes, green bell pepper, sliced cucumber onion, olives, and feta cheese.",
      image: menu1,
      badge: "Seasonal"
    },
    {
      id: 2,
      name: "Lasagne",
      price: "$40.00",
      description: "Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices",
      image: menu2
    },
    {
      id: 3,
      name: "Butternut Pumpkin",
      price: "$10.00",
      description: "Typesetting industry lorem Lorem Ipsum is simply dummy text of the priand.",
      image: menu3
    },
    {
      id: 4,
      name: "Tokusen Wagyu",
      price: "$39.00",
      description: "Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices.",
      image: menu4,
      badge: "New"
    },
    {
      id: 5,
      name: "Olivas Rellenas",
      price: "$25.00",
      description: "Avocados with crab meat, red onion, crab salad stuffed red bell pepper and green bell pepper.",
      image: menu5
    },
    {
      id: 6,
      name: "Opu Fish",
      price: "$49.00",
      description: "Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices",
      image: menu6
    }
  ];

  // Service Items avec images importées
  const serviceItems = [
    {
      title: "Breakfast",
      image: service1,
      link: "#"
    },
    {
      title: "Appetizers",
      image: service2,
      link: "#"
    },
    {
      title: "Drinks",
      image: service3,
      link: "#"
    }
  ];

  // Feature Items avec images importées
  const featureItems = [
    {
      icon: featuresIcon1,
      title: "Hygienic Food",
      description: "Lorem Ipsum is simply dummy printing and typesetting."
    },
    {
      icon: featuresIcon2,
      title: "Fresh Environment",
      description: "Lorem Ipsum is simply dummy printing and typesetting."
    },
    {
      icon: featuresIcon3,
      title: "Skilled Chefs",
      description: "Lorem Ipsum is simply dummy printing and typesetting."
    },
    {
      icon: featuresIcon4,
      title: "Event & Party",
      description: "Lorem Ipsum is simply dummy printing and typesetting."
    }
  ];

  // Event Items avec images importées
  const eventItems = [
    {
      image: event1,
      date: "15/09/2022",
      category: "Food, Flavour",
      title: "Flavour so good you'll try to eat with your eyes."
    },
    {
      image: event2,
      date: "08/09/2022",
      category: "Healthy Food",
      title: "Flavour so good you'll try to eat with your eyes."
    },
    {
      image: event3,
      date: "03/09/2022",
      category: "Recipie",
      title: "Flavour so good you'll try to eat with your eyes."
    }
  ];

  if (!isLoaded) {
    return (
      <div className="preload" data-preaload>
        <div className="circle"></div>
        <p className="text">Grilli</p>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container">
          <address className="topbar-item">
            <div className="icon">
              <IoLocationOutline />
            </div>
            <span className="span">
              Restaurant St, Delicious City, London 9578, UK
            </span>
          </address>

          <div className="separator"></div>

          <div className="topbar-item item-2">
            <div className="icon">
              <IoTimeOutline />
            </div>
            <span className="span">Daily : 8.00 am to 10.00 pm</span>
          </div>

          <a href="tel:+11234567890" className="topbar-item link">
            <div className="icon">
              <IoCallOutline />
            </div>
            <span className="span">+1 123 456 7890</span>
          </a>

          <div className="separator"></div>

          <a href="mailto:booking@restaurant.com" className="topbar-item link">
            <div className="icon">
              <IoMailOutline />
            </div>
            <span className="span">booking@restaurant.com</span>
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="header" data-header ref={headerRef}>
        <div className="container">
          <a href="#" className="logo">
            <img src={logo} width="160" height="50" alt="Grilli - Home" />
          </a>

          <nav className="navbar" data-navbar ref={navbarRef}>
            <button 
              className="close-btn" 
              aria-label="close menu" 
              onClick={toggleNavbar}
            >
              <IoCloseOutline />
            </button>

            <a href="#" className="logo">
              <img src={logo} width="160" height="50" alt="Grilli - Home" />
            </a>

            <ul className="navbar-list">
              <li className="navbar-item">
                <a href="#home" className="navbar-link hover-underline active">
                  <div className="separator"></div>
                  <span className="span">Home</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="#menu" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">Menus</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="#about" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">About Us</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="#" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">Our Chefs</span>
                </a>
              </li>
              <li className="navbar-item">
                <a href="#" className="navbar-link hover-underline">
                  <div className="separator"></div>
                  <span className="span">Contact</span>
                </a>
              </li>
            </ul>

            <div className="text-center">
              <p className="headline-1 navbar-title">Visit Us</p>
              <address className="body-4">
                Restaurant St, Delicious City, <br />
                London 9578, UK
              </address>
              <p className="body-4 navbar-text">Open: 9.30 am - 2.30pm</p>
              <a href="mailto:booking@grilli.com" className="body-4 sidebar-link">booking@grilli.com</a>
              <div className="separator"></div>
              <p className="contact-label">Booking Request</p>
              <a href="tel:+88123123456" className="body-1 contact-number hover-underline">
                +88-123-123456
              </a>
            </div>
          </nav>

          <a href="#" className="btn btn-secondary">
            <span className="text text-1">Find A Table</span>
            <span className="text text-2" aria-hidden="true">Find A Table</span>
          </a>

          <button 
            className="nav-open-btn" 
            aria-label="open menu" 
            onClick={toggleNavbar}
          >
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </button>

          <div 
            className="overlay" 
            data-overlay 
            ref={overlayRef}
            onClick={toggleNavbar}
          ></div>
        </div>
      </header>

      <main>
        <article>
          {/* Hero Section */}
          <section className="hero text-center" aria-label="home" id="home">
            <div className="hero-slider">
              {/* Slide 1 */}
              <div className={`slider-item ${currentSlide === 0 ? 'active' : ''}`}>
                <div className="slider-bg">
                  <img src={heroSlider1} width="1880" height="950" alt="" className="img-cover" />
                </div>
                <p className="label-2 section-subtitle slider-reveal">Traditional & Hygiene</p>
                <h1 className="display-1 hero-title slider-reveal">
                  For the love of <br />
                  delicious food
                </h1>
                <p className="body-2 hero-text slider-reveal">
                  Come with family & feel the joy of mouthwatering food
                </p>
                <a href="#" className="btn btn-primary slider-reveal">
                  <span className="text text-1">View Our Menu</span>
                  <span className="text text-2" aria-hidden="true">View Our Menu</span>
                </a>
              </div>

              {/* Slide 2 */}
              <div className={`slider-item ${currentSlide === 1 ? 'active' : ''}`}>
                <div className="slider-bg">
                  <img src={heroSlider2} width="1880" height="950" alt="" className="img-cover" />
                </div>
                <p className="label-2 section-subtitle slider-reveal">delightful experience</p>
                <h1 className="display-1 hero-title slider-reveal">
                  Flavors Inspired by <br />
                  the Seasons
                </h1>
                <p className="body-2 hero-text slider-reveal">
                  Come with family & feel the joy of mouthwatering food
                </p>
                <a href="#" className="btn btn-primary slider-reveal">
                  <span className="text text-1">View Our Menu</span>
                  <span className="text text-2" aria-hidden="true">View Our Menu</span>
                </a>
              </div>

              {/* Slide 3 */}
              <div className={`slider-item ${currentSlide === 2 ? 'active' : ''}`}>
                <div className="slider-bg">
                  <img src={heroSlider3} width="1880" height="950" alt="" className="img-cover" />
                </div>
                <p className="label-2 section-subtitle slider-reveal">amazing & delicious</p>
                <h1 className="display-1 hero-title slider-reveal">
                  Where every flavor <br />
                  tells a story
                </h1>
                <p className="body-2 hero-text slider-reveal">
                  Come with family & feel the joy of mouthwatering food
                </p>
                <a href="#" className="btn btn-primary slider-reveal">
                  <span className="text text-1">View Our Menu</span>
                  <span className="text text-2" aria-hidden="true">View Our Menu</span>
                </a>
              </div>
            </div>

            <button 
              className="slider-btn prev" 
              aria-label="slide to previous"
              onClick={slidePrev}
              onMouseEnter={stopAutoSlide}
              onMouseLeave={startAutoSlide}
            >
              <IoChevronBack />
            </button>

            <button 
              className="slider-btn next" 
              aria-label="slide to next"
              onClick={slideNext}
              onMouseEnter={stopAutoSlide}
              onMouseLeave={startAutoSlide}
            >
              <IoChevronForward />
            </button>

            <a href="#" className="hero-btn has-after">
              <img src={heroIcon} width="48" height="48" alt="booking icon" />
              <span className="label-2 text-center span">Book A Table</span>
            </a>
          </section>

          {/* Service Section */}
          <section className="section service bg-black-10 text-center" aria-label="service">
            <div className="container">
              <p className="section-subtitle label-2">Flavors For Royalty</p>
              <h2 className="headline-1 section-title">We Offer Top Notch</h2>
              <p className="section-text">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry lorem Ipsum has been the industrys
                standard dummy text ever.
              </p>

              <ul className="grid-list">
                {serviceItems.map((service, index) => (
                  <li key={index}>
                    <div className="service-card">
                      <a href={service.link} className="has-before hover:shine">
                        <figure className="card-banner img-holder" style={{ '--width': 285, '--height': 336 }}>
                          <img src={service.image} width="285" height="336" loading="lazy" alt={service.title} className="img-cover" />
                        </figure>
                      </a>
                      <div className="card-content">
                        <h3 className="title-4 card-title">
                          <a href={service.link}>{service.title}</a>
                        </h3>
                        <a href={service.link} className="btn-text hover-underline label-2">View Menu</a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <img src={shape1} width="246" height="412" loading="lazy" alt="shape" className="shape shape-1 move-anim" />
              <img src={shape2} width="343" height="345" loading="lazy" alt="shape" className="shape shape-2 move-anim" />
            </div>
          </section>

          {/* About Section */}
          <section className="section about text-center" aria-labelledby="about-label" id="about">
            <div className="container">
              <div className="about-content">
                <p className="label-2 section-subtitle" id="about-label">Our Story</p>
                <h2 className="headline-1 section-title">Every Flavor Tells a Story</h2>
                <p className="section-text">
                  Lorem Ipsum is simply dummy text of the printingand typesetting industry lorem Ipsum has been the
                  industrys standard dummy text ever since the when an unknown printer took a galley of type and scrambled
                  it to make a type specimen book It has survived not only five centuries, but also the leap into.
                </p>
                <div className="contact-label">Book Through Call</div>
                <a href="tel:+804001234567" className="body-1 contact-number hover-underline">+80 (400) 123 4567</a>
                <a href="#" className="btn btn-primary">
                  <span className="text text-1">Read More</span>
                  <span className="text text-2" aria-hidden="true">Read More</span>
                </a>
              </div>

              <figure className="about-banner">
                <img 
                  src={aboutBanner} 
                  width="570" 
                  height="570" 
                  loading="lazy" 
                  alt="about banner" 
                  className="w-100" 
                  ref={addToParallaxRefs}
                  data-parallax-speed="1"
                />
                <div 
                  className="abs-img abs-img-1 has-before" 
                  ref={addToParallaxRefs}
                  data-parallax-speed="1.75"
                >
                  <img src={aboutAbsImage} width="285" height="285" loading="lazy" alt="" className="w-100" />
                </div>
                <div className="abs-img abs-img-2 has-before">
                  <img src={badge2} width="133" height="134" loading="lazy" alt="" />
                </div>
              </figure>

              <img src={shape3} width="197" height="194" loading="lazy" alt="" className="shape" />
            </div>
          </section>

          {/* Special Dish Section */}
          <section className="special-dish text-center" aria-labelledby="dish-label">
            <div className="special-dish-banner">
              <img src={specialDishBanner} width="940" height="900" loading="lazy" alt="special dish" className="img-cover" />
            </div>
            <div className="special-dish-content bg-black-10">
              <div className="container">
                <img src={badge1} width="28" height="41" loading="lazy" alt="badge" className="abs-img" />
                <p className="section-subtitle label-2">Special Dish</p>
                <h2 className="headline-1 section-title">Lobster Tortellini</h2>
                <p className="section-text">
                  Lorem Ipsum is simply dummy text of the printingand typesetting industry lorem Ipsum has been the
                  industrys standard dummy text ever since the when an unknown printer took a galley of type.
                </p>
                <div className="wrapper">
                  <del className="del body-3">$40.00</del>
                  <span className="span body-1">$20.00</span>
                </div>
                <a href="#" className="btn btn-primary">
                  <span className="text text-1">View All Menu</span>
                  <span className="text text-2" aria-hidden="true">View All Menu</span>
                </a>
              </div>
            </div>
            <img src={shape4} width="179" height="359" loading="lazy" alt="" className="shape shape-1" />
            <img src={shape9} width="351" height="462" loading="lazy" alt="" className="shape shape-2" />
          </section>

          {/* Menu Section */}
          <section className="section menu" aria-label="menu-label" id="menu">
            <div className="container">
              <p className="section-subtitle text-center label-2">Special Selection</p>
              <h2 className="headline-1 section-title text-center">Delicious Menu</h2>

              <ul className="grid-list">
                {menuItems.map(item => (
                  <li key={item.id}>
                    <div className="menu-card hover:card">
                      <figure className="card-banner img-holder" style={{ '--width': 100, '--height': 100 }}>
                        <img src={item.image} width="100" height="100" loading="lazy" alt={item.name} className="img-cover" />
                      </figure>
                      <div>
                        <div className="title-wrapper">
                          <h3 className="title-3">
                            <a href="#" className="card-title">{item.name}</a>
                          </h3>
                          {item.badge && <span className="badge label-1">{item.badge}</span>}
                          <span className="span title-2">{item.price}</span>
                        </div>
                        <p className="card-text label-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="menu-text text-center">
                During winter daily from <span className="span">7:00 pm</span> to <span className="span">9:00 pm</span>
              </p>

              <a href="#" className="btn btn-primary">
                <span className="text text-1">View All Menu</span>
                <span className="text text-2" aria-hidden="true">View All Menu</span>
              </a>

              <img src={shape5} width="921" height="1036" loading="lazy" alt="shape" className="shape shape-2 move-anim" />
              <img src={shape6} width="343" height="345" loading="lazy" alt="shape" className="shape shape-3 move-anim" />
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="section testi text-center has-bg-image" style={{ backgroundImage: `url(${testiBg})` }} aria-label="testimonials">
            <div className="container">
              <div className="quote">”</div>
              <p className="headline-2 testi-text">
                I wanted to thank you for inviting me down for that amazing dinner the other night. The food was
                extraordinary.
              </p>
              <div className="wrapper">
                <div className="separator"></div>
                <div className="separator"></div>
                <div className="separator"></div>
              </div>
              <div className="profile">
                <img src={testiAvatar} width="100" height="100" loading="lazy" alt="Sam Jhonson" className="img" />
                <p className="label-2 profile-name">Sam Jhonson</p>
              </div>
            </div>
          </section>

          {/* Reservation Section */}
          <section className="reservation">
            <div className="container">
              <div className="form reservation-form bg-black-10">
                <form action="" className="form-left">
                  <h2 className="headline-1 text-center">Online Reservation</h2>
                  <p className="form-text text-center">
                    Booking request <a href="tel:+88123123456" className="link">+88-123-123456</a>
                    or fill out the order form
                  </p>

                  <div className="input-wrapper">
                    <input type="text" name="name" placeholder="Your Name" autoComplete="off" className="input-field" />
                    <input type="tel" name="phone" placeholder="Phone Number" autoComplete="off" className="input-field" />
                  </div>

                  <div className="input-wrapper">
                    <div className="icon-wrapper">
                      <IoPersonOutline />
                      <select name="person" className="input-field">
                        <option value="1-person">1 Person</option>
                        <option value="2-person">2 Person</option>
                        <option value="3-person">3 Person</option>
                        <option value="4-person">4 Person</option>
                        <option value="5-person">5 Person</option>
                        <option value="6-person">6 Person</option>
                        <option value="7-person">7 Person</option>
                      </select>
                      <IoChevronDown />
                    </div>

                    <div className="icon-wrapper">
                      <IoCalendarClearOutline />
                      <input type="date" name="reservation-date" className="input-field" />
                      <IoChevronDown />
                    </div>

                    <div className="icon-wrapper">
                      <IoTimeOutline />
                      <select name="time" className="input-field">
                        <option value="08:00am">08 : 00 am</option>
                        <option value="09:00am">09 : 00 am</option>
                        <option value="10:00am">10 : 00 am</option>
                        <option value="11:00am">11 : 00 am</option>
                        <option value="12:00pm">12 : 00 pm</option>
                        <option value="01:00pm">01 : 00 pm</option>
                        <option value="02:00pm">02 : 00 pm</option>
                        <option value="03:00pm">03 : 00 pm</option>
                        <option value="04:00pm">04 : 00 pm</option>
                        <option value="05:00pm">05 : 00 pm</option>
                        <option value="06:00pm">06 : 00 pm</option>
                        <option value="07:00pm">07 : 00 pm</option>
                        <option value="08:00pm">08 : 00 pm</option>
                        <option value="09:00pm">09 : 00 pm</option>
                        <option value="10:00pm">10 : 00 pm</option>
                      </select>
                      <IoChevronDown />
                    </div>
                  </div>

                  <textarea name="message" placeholder="Message" autoComplete="off" className="input-field"></textarea>

                  <button type="submit" className="btn btn-secondary">
                    <span className="text text-1">Book A Table</span>
                    <span className="text text-2" aria-hidden="true">Book A Table</span>
                  </button>
                </form>

                <div className="form-right text-center" style={{ backgroundImage: `url(${formPattern})` }}>
                  <h2 className="headline-1 text-center">Contact Us</h2>
                  <p className="contact-label">Booking Request</p>
                  <a href="tel:+88123123456" className="body-1 contact-number hover-underline">+88-123-123456</a>
                  <div className="separator"></div>
                  <p className="contact-label">Location</p>
                  <address className="body-4">
                    Restaurant St, Delicious City, <br />
                    London 9578, UK
                  </address>
                  <p className="contact-label">Lunch Time</p>
                  <p className="body-4">
                    Monday to Sunday <br />
                    11.00 am - 2.30pm
                  </p>
                  <p className="contact-label">Dinner Time</p>
                  <p className="body-4">
                    Monday to Sunday <br />
                    05.00 pm - 10.00pm
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="section features text-center" aria-label="features">
            <div className="container">
              <p className="section-subtitle label-2">Why Choose Us</p>
              <h2 className="headline-1 section-title">Our Strength</h2>

              <ul className="grid-list">
                {featureItems.map((feature, index) => (
                  <li className="feature-item" key={index}>
                    <div className="feature-card">
                      <div className="card-icon">
                        <img src={feature.icon} width="100" height="80" loading="lazy" alt="icon" />
                      </div>
                      <h3 className="title-2 card-title">{feature.title}</h3>
                      <p className="label-1 card-text">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <img src={shape7} width="208" height="178" loading="lazy" alt="shape" className="shape shape-1" />
              <img src={shape8} width="120" height="115" loading="lazy" alt="shape" className="shape shape-2" />
            </div>
          </section>

          {/* Event Section */}
          <section className="section event bg-black-10" aria-label="event">
            <div className="container">
              <p className="section-subtitle label-2 text-center">Recent Updates</p>
              <h2 className="section-title headline-1 text-center">Upcoming Event</h2>

              <ul className="grid-list">
                {eventItems.map((event, index) => (
                  <li key={index}>
                    <div className="event-card has-before hover:shine">
                      <div className="card-banner img-holder" style={{ '--width': 350, '--height': 450 }}>
                        <img src={event.image} width="350" height="450" loading="lazy" alt={event.title} className="img-cover" />
                        <time className="publish-date label-2" dateTime={event.date.replace(/\//g, '-')}>{event.date}</time>
                      </div>
                      <div className="card-content">
                        <p className="card-subtitle label-2 text-center">{event.category}</p>
                        <h3 className="card-title title-2 text-center">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <a href="#" className="btn btn-primary">
                <span className="text text-1">View Our Blog</span>
                <span className="text text-2" aria-hidden="true">View Our Blog</span>
              </a>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="footer section has-bg-image text-center" style={{ backgroundImage: `url(${footerBg})` }}>
        <div className="container">
          <div className="footer-top grid-list">
            <div className="footer-brand has-before has-after">
              <a href="#" className="logo">
                <img src={logo} width="160" height="50" loading="lazy" alt="grilli home" />
              </a>
              <address className="body-4">
                Restaurant St, Delicious City, London 9578, UK
              </address>
              <a href="mailto:booking@grilli.com" className="body-4 contact-link">booking@grilli.com</a>
              <a href="tel:+88123123456" className="body-4 contact-link">Booking Request : +88-123-123456</a>
              <p className="body-4">
                Open : 09:00 am - 01:00 pm
              </p>
              <div className="wrapper">
                <div className="separator"></div>
                <div className="separator"></div>
                <div className="separator"></div>
              </div>
              <p className="title-1">Get News & Offers</p>
              <p className="label-1">
                Subscribe us & Get <span className="span">25% Off.</span>
              </p>
              <form action="" className="input-wrapper">
                <div className="icon-wrapper">
                  <IoMailOutline />
                  <input type="email" name="email_address" placeholder="Your email" autoComplete="off" className="input-field" />
                </div>
                <button type="submit" className="btn btn-secondary">
                  <span className="text text-1">Subscribe</span>
                  <span className="text text-2" aria-hidden="true">Subscribe</span>
                </button>
              </form>
            </div>

            <ul className="footer-list">
              <li><a href="#" className="label-2 footer-link hover-underline">Home</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">Menus</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">About Us</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">Our Chefs</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">Contact</a></li>
            </ul>

            <ul className="footer-list">
              <li><a href="#" className="label-2 footer-link hover-underline">Facebook</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">Instagram</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">Twitter</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">Youtube</a></li>
              <li><a href="#" className="label-2 footer-link hover-underline">Google Map</a></li>
            </ul>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              &copy; 2022 Grilli. All Rights Reserved | Crafted by <a href="https://github.com/codewithsadee" target="_blank" rel="noopener noreferrer" className="link">codewithsadee</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <a 
        href="#top" 
        className={`back-top-btn ${isBackTopVisible ? 'active' : ''}`} 
        aria-label="back to top" 
        ref={backTopBtnRef}
      >
        <IoChevronUp />
      </a>
    </>
  );
};

export default RestaurantTemplate;