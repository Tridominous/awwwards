import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti"; 
import { useWindowScroll } from "react-use"; 
import gsap from "gsap";

// Navigation items to be displayed in the Navbar
const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const Navbar = () => {
    // State to manage audio playing status
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    // State to manage the active state of the audio indicator
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);

    // State to keep track of the last Y scroll position
    const [lastScrollY, setlastScrollY] = useState(0);

    // State to determine the visibility of the navbar
    const [isNavVisible, setisNavVisible] = useState(true);

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
    });

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

                        {/* Audio toggle button with indicator animation */}
                        <button
                            onClick={toggleAudioIndicator}
                            className="ml-10 flex items-center space-x-0.5"
                        >
                            <audio
                                ref={audioElementRef}
                                className="hidden"
                                src="/audio/no_pain_no_gain.mp3"
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
