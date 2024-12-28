import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti"; 
import { useWindowScroll } from "react-use"; 
import gsap from "gsap";

// Navigation items to be displayed in the Navbar
const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const Navbar = () => {
    // State to manage audio playing status
    const [isAudioPlaying, setIsAudioPlaying] = useState(true);

    // State to manage the active state of the audio indicator
    const [isIndicatorActive, setIsIndicatorActive] = useState(true);

    // State to keep track of the last Y scroll position
    const [lastScrollY, setlastScrollY] = useState(0);

    // State to determine the visibility of the navbar
    const [isNavVisible, setisNavVisible] = useState(true);

    // State to manage the visibility of the mobile menu
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

    // Reference to the navbar container element
    const navContainerRef = useRef(null);

    // Reference to the audio element
    const audioElementRef = useRef(null);

    // Getting the current scroll Y position
    const { y: currentScrollY } = useWindowScroll();

    // Effect to handle navbar visibility based on scroll direction
    useEffect(() => {
        if (currentScrollY === 0) {
            // Show navbar when scrolled to the top
            setisNavVisible(true);
            navContainerRef.current.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY) {
            // Hide navbar when scrolling down
            setisNavVisible(false);
            navContainerRef.current.classList.add("floating-nav");
        } else if (currentScrollY < lastScrollY) {
            // Show navbar when scrolling up
            setisNavVisible(true);
            navContainerRef.current.classList.add("floating-nav");
        }
        setlastScrollY(currentScrollY); // Update last scroll position
    }, [currentScrollY, lastScrollY]);

    // Effect to animate the navbar visibility
    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100, // Slide navbar in or out
            opacity: isNavVisible ? 1 : 0, // Adjust opacity for visibility
            duration: 0.2, // Animation duration
        });
    }, [isNavVisible]);

    // Toggle audio playback and indicator animation
    const toggleAudioIndicator = () => {
        setIsAudioPlaying((prev) => !prev); // Toggle audio playing state
        setIsIndicatorActive((prev) => !prev); // Toggle indicator active state
    };

    // Effect to play or pause the audio based on the isAudioPlaying state
    useEffect(() => {
        if (isAudioPlaying) {
            audioElementRef.current.play(); // Play audio
        } else {
            audioElementRef.current.pause(); // Pause audio
        }
    }, [isAudioPlaying]);

    // Pause audio when the tab is not visible and play when it becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                audioElementRef.current.pause();
            } else if (isAudioPlaying) {
                audioElementRef.current.play();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isAudioPlaying]);

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuVisible((prev) => !prev);
    };

    // Close mobile menu when a nav link is clicked
    const handleNavLinkClick = () => {
        setIsMobileMenuVisible(false);
    };

    return (
        <div
            ref={navContainerRef}
            className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
        >
            <header className="absolute top-1/2 w-full -translate-y-1/2">
                <nav className="flex size-full items-center justify-between p-4">
                    <div className="flex items-center gap-7">
                        {/* Logo */}
                        <img src="/img/logo.png" alt="logo" className="w-10" />

                        {/* Products button */}
                        <Button
                            id="product-button"
                            title="Products"
                            rightIcon={<TiLocationArrow />}
                            containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
                        />
                    </div>

                    <div className="flex h-full items-center">
                        {/* Navigation links for larger screens */}
                        <div className="hidden md:block">
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="nav-hover-btn"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Hamburger menu button for small screens */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden flex flex-col justify-around w-6 h-6 bg-transparent border-none cursor-pointer p-0 z-10 focus:outline-none"
                        >
                            <span
                                className={`block w-6 h-0.5 bg-violet-50 rounded transition-transform duration-300 ease-in-out ${
                                    isMobileMenuVisible ? "transform rotate-45 translate-y-1.5" : ""
                                }`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-violet-50 rounded transition-opacity duration-300 ease-in-out ${
                                    isMobileMenuVisible ? "opacity-0" : ""
                                }`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-violet-50 rounded transition-transform duration-300 ease-in-out ${
                                    isMobileMenuVisible ? "transform -rotate-45 -translate-y-1.5" : ""
                                }`}
                            ></span>
                        </button>

                        {/* Mobile menu */}
                        {isMobileMenuVisible && (
                            <div className="absolute top-16 left-0 w-full bg-violet-50 shadow-md md:hidden rounded-md">
                                {navItems.map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="block p-4 border-b"
                                        onClick={handleNavLinkClick}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Audio toggle button with indicator animation */}
                        <button
                            onClick={toggleAudioIndicator}
                            className="ml-10 flex items-center space-x-0.5"
                        >
                            <audio
                                ref={audioElementRef}
                                className="hidden"
                                src="/audio/no_pain_no_gain.mp3"
                                autoPlay
                                loop
                            />
                            {[1, 2, 3, 4].map((bar) => (
                                <div
                                    key={bar}
                                    className={`indicator-line ${
                                        isIndicatorActive ? "active" : ""
                                    }`}
                                    style={{ animationDelay: `${bar * 0.1}s` }}
                                ></div>
                            ))}
                        </button>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Navbar;