'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Church, Calendar, BookOpen, Clock, Heart, Users, House } from 'lucide-react';
import  './nav.css';
import  Logo from '@/components/images/logo';



export function PublicNav() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home', icon: House },
        { href: '/aboutOrthodoxy', label: 'About Orthodoxy', icon: BookOpen },
        { href: '/services', label: 'Services', icon: Clock },
        { href: '/about-us', label: 'About Us', icon: Church },
        { href: '/contact', label: 'Contact', icon: Calendar },
        { href: '/clergy', label: 'Clergy', icon: Users },
        { href: '/literature', label: 'Publications', icon: BookOpen },
       
    ];

    return ( 
        <nav className="main-navbar">
            <section className={'content'}>
                <div className="navbar-container">
                    <div className="navbar-inner">

                        {/* Logo / Church Branding */}
                        <div className="navbar-logo">
                            <Link href="/" className="logo-link">
                                <Logo className="icon-logo"/>
                                <span>St Thomas <br/> Orthodox Church </span>

                            </Link>
                        </div>

                        {/* Desktop Links */}
                        <div className="desktop-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="nav-link"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {/* Call to Action */}
                            <div className="desktop-cta">
                                <Link href="/give" className="btn-give">
                                    <Heart className="icon-btn"/>
                                    Give
                                </Link>
                            </div>
                        </div>


                        {/* Mobile Hamburger Button */}
                        <div className="mobile-toggle-wrapper">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="btn-mobile-toggle"
                                aria-controls="mobile-menu"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X className="icon-menu"/> : <Menu className="icon-menu"/>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Dropdown */}
                {isOpen && (
                    <div className="mobile-menu" id="mobile-menu">
                        <div className="mobile-menu-inner">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="mobile-nav-link"
                                    >
                                        <Icon className="icon-mobile-link"/>
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="mobile-cta-wrapper">
                                <Link
                                    href="/give"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-give-mobile"
                                >
                                    <Heart className="icon-btn"/>
                                    Give Online
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </nav>
    );
}